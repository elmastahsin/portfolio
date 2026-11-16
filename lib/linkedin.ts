import "server-only";
import crypto from "node:crypto";
import { deleteSetting, getSetting, setSetting } from "@/lib/database";
import type { BlogPost } from "@/data/blogs";

const TOKEN_KEY = "linkedin_token";
const STATE_KEY = "linkedin_oauth_state";
const SCOPES = "openid profile w_member_social";

interface StoredToken {
  accessToken: string;
  expiresAt: string;
  refreshToken?: string;
  refreshExpiresAt?: string;
  personUrn: string;
  name?: string;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
}

export function getSiteUrl(): string {
  return (process.env.SITE_URL || "https://tahsinelmas.com").replace(/\/$/, "");
}

function getAppCredentials() {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET are not configured");
  }
  return { clientId, clientSecret };
}

function getRedirectUri(): string {
  return `${getSiteUrl()}/api/linkedin/callback`;
}

// LinkedIn versions its REST API monthly and retires versions after about a
// year, so default to a version a few months old unless one is pinned.
function getApiVersion(): string {
  if (process.env.LINKEDIN_API_VERSION) return process.env.LINKEDIN_API_VERSION;
  const date = new Date();
  date.setUTCMonth(date.getUTCMonth() - 3);
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export async function createAuthorizationUrl(): Promise<string> {
  const { clientId } = getAppCredentials();
  const state = crypto.randomBytes(24).toString("hex");
  await setSetting(STATE_KEY, {
    state,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    state,
    scope: SCOPES,
  });
  return `https://www.linkedin.com/oauth/v2/authorization?${params}`;
}

async function requestToken(body: Record<string, string>): Promise<TokenResponse> {
  const { clientId, clientSecret } = getAppCredentials();
  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...body, client_id: clientId, client_secret: clientSecret }),
  });
  if (!res.ok) {
    throw new Error(`LinkedIn token request failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()) as TokenResponse;
}

function toStoredToken(token: TokenResponse, personUrn: string, name?: string): StoredToken {
  const now = Date.now();
  return {
    accessToken: token.access_token,
    expiresAt: new Date(now + token.expires_in * 1000).toISOString(),
    refreshToken: token.refresh_token,
    refreshExpiresAt: token.refresh_token_expires_in
      ? new Date(now + token.refresh_token_expires_in * 1000).toISOString()
      : undefined,
    personUrn,
    name,
  };
}

export async function completeAuthorization(code: string, state: string): Promise<StoredToken> {
  const saved = await getSetting<{ state: string; expiresAt: string }>(STATE_KEY);
  await deleteSetting(STATE_KEY);
  if (
    !saved ||
    new Date(saved.expiresAt).getTime() < Date.now() ||
    saved.state.length !== state.length ||
    !crypto.timingSafeEqual(Buffer.from(saved.state), Buffer.from(state))
  ) {
    throw new Error("Invalid or expired OAuth state");
  }

  const token = await requestToken({
    grant_type: "authorization_code",
    code,
    redirect_uri: getRedirectUri(),
  });

  const userRes = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!userRes.ok) {
    throw new Error(`LinkedIn userinfo failed (${userRes.status}): ${await userRes.text()}`);
  }
  const user = (await userRes.json()) as { sub: string; name?: string };

  const stored = toStoredToken(token, `urn:li:person:${user.sub}`, user.name);
  await setSetting(TOKEN_KEY, stored);
  return stored;
}

async function getValidToken(): Promise<StoredToken | null> {
  const stored = await getSetting<StoredToken>(TOKEN_KEY);
  if (!stored) return null;

  // Refresh a day early so a weekly publish never races the expiry.
  const expiresSoon = new Date(stored.expiresAt).getTime() - Date.now() < 24 * 60 * 60 * 1000;
  if (!expiresSoon) return stored;

  const canRefresh =
    stored.refreshToken &&
    (!stored.refreshExpiresAt || new Date(stored.refreshExpiresAt).getTime() > Date.now());
  if (!canRefresh) return null;

  const refreshed = await requestToken({
    grant_type: "refresh_token",
    refresh_token: stored.refreshToken!,
  });
  const next = toStoredToken(refreshed, stored.personUrn, stored.name);
  next.refreshToken ??= stored.refreshToken;
  next.refreshExpiresAt ??= stored.refreshExpiresAt;
  await setSetting(TOKEN_KEY, next);
  return next;
}

export async function getLinkedInStatus() {
  const configured = Boolean(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET);
  const stored = await getSetting<StoredToken>(TOKEN_KEY);
  const connected = Boolean(stored && new Date(stored.expiresAt).getTime() > Date.now());
  return {
    configured,
    connected,
    name: stored?.name ?? null,
    expiresAt: stored?.expiresAt ?? null,
  };
}

export async function disconnectLinkedIn(): Promise<void> {
  await deleteSetting(TOKEN_KEY);
}

// Posts API commentary uses LinkedIn's "little text" format, where these
// characters are reserved and must be escaped or the post is rejected or cut.
const RESERVED = /[\\|{}@[\]()<>*_~#]/g;

export function toLittleText(text: string): string {
  return text
    .split(/(#[\p{L}\p{N}_]+)/u)
    .map((part) =>
      /^#[\p{L}\p{N}_]+$/u.test(part)
        ? `{hashtag|\\#|${part.slice(1)}}`
        : part.replace(RESERVED, (c) => `\\${c}`),
    )
    .join("");
}

export async function shareBlogPost(post: BlogPost): Promise<string> {
  const token = await getValidToken();
  if (!token) {
    throw new Error("LinkedIn is not connected or the token expired — reconnect it from /admin");
  }

  const url = `${getSiteUrl()}/blog/${post.slug}`;
  const commentary = post.linkedinPost?.trim() || `${post.title}\n\n${post.summary}`;

  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": getApiVersion(),
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: token.personUrn,
      commentary: toLittleText(commentary),
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      content: {
        article: {
          source: url,
          title: post.title,
          description: post.summary,
        },
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`LinkedIn post failed (${res.status}): ${await res.text()}`);
  }
  return res.headers.get("x-restli-id") || "";
}
