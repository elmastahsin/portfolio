// Weekly blog draft generator.
//
// Gathers the author's GitHub activity, the topic pool and this week's tech
// news, asks Claude to write one bilingual post plus a LinkedIn caption, and
// saves it as a *draft* via the portfolio API. Nothing is published here: the
// draft is approved from /admin, which publishes it and shares it on LinkedIn.
//
// Env:
//   ANTHROPIC_API_KEY        required
//   PORTFOLIO_ADMIN_TOKEN    required (admin password, sent as Bearer token)
//   PORTFOLIO_API_URL        default http://localhost:3000
//   SITE_URL                 public URL used in notifications, default https://tahsinelmas.com
//   GITHUB_USERNAME          default elmastahsin
//   GITHUB_TOKEN             optional, raises GitHub API rate limits
//   NTFY_TOPIC               optional, push notification via ntfy.sh when a draft is ready
//   DRY_RUN=1                print the post instead of saving it

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

const here = path.dirname(fileURLToPath(import.meta.url));
const MODEL = "claude-opus-5-5";
const API_URL = (process.env.PORTFOLIO_API_URL || "http://localhost:3000").replace(/\/$/, "");
const SITE_URL = (process.env.SITE_URL || "https://tahsinelmas.com").replace(/\/$/, "");
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "elmastahsin";
const DRY_RUN = process.env.DRY_RUN === "1";
const ADMIN_TOKEN = process.env.PORTFOLIO_ADMIN_TOKEN;
const CATEGORIES = ["Backend", "Frontend", "AI & ML", "System Design", "DevOps"];

if (!ADMIN_TOKEN && !DRY_RUN) {
  throw new Error("PORTFOLIO_ADMIN_TOKEN is required");
}

const client = new Anthropic();

async function portfolioFetch(pathname, init = {}) {
  const res = await fetch(`${API_URL}${pathname}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: ADMIN_TOKEN || "", ...init.headers },
  });
  if (!res.ok) throw new Error(`${init.method || "GET"} ${pathname} failed (${res.status}): ${await res.text()}`);
  return res.json();
}

async function getGithubActivity() {
  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`, { headers });
  if (!res.ok) {
    console.warn(`GitHub events unavailable (${res.status}), continuing without them`);
    return "No GitHub activity available.";
  }

  const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const lines = [];
  for (const event of await res.json()) {
    if (new Date(event.created_at).getTime() < since) continue;
    const repo = event.repo.name;
    if (event.type === "PushEvent") {
      for (const commit of event.payload.commits || []) {
        lines.push(`- [${repo}] commit: ${commit.message.split("\n")[0]}`);
      }
    } else if (event.type === "CreateEvent") {
      lines.push(`- [${repo}] created ${event.payload.ref_type}${event.payload.ref ? ` ${event.payload.ref}` : ""}`);
    } else if (event.type === "ReleaseEvent") {
      lines.push(`- [${repo}] released ${event.payload.release?.tag_name}: ${event.payload.release?.name || ""}`);
    } else if (event.type === "PullRequestEvent") {
      lines.push(`- [${repo}] PR ${event.payload.action}: ${event.payload.pull_request?.title}`);
    }
  }
  return lines.length ? lines.slice(0, 80).join("\n") : "No public GitHub activity in the last 7 days.";
}

// Runs the server-side web search loop, resuming when the server pauses the turn.
async function researchTechNews(focus) {
  const messages = [
    {
      role: "user",
      content:
        `Search the web for the most notable news from the past 7 days relevant to a backend engineer working with ${focus}. ` +
        "Return 5-8 items, each with a one-paragraph factual summary, why it matters to backend engineers, the publication date and the source URL. " +
        "Only include items you actually found in search results.",
    },
  ];

  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 8 }],
      messages,
    });

    if (response.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: response.content });
      continue;
    }
    if (response.stop_reason === "refusal") {
      console.warn("News research was declined, continuing without it");
      return "No news research available this week.";
    }
    return response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");
  }
  return "No news research available this week.";
}

const LocalizedPost = z.object({
  title: z.string().describe("Specific, non-clickbait title"),
  summary: z.string().describe("1-2 sentence summary shown on the blog card"),
  contentHtml: z.string().describe("Article body as HTML using only h2, h3, p, ul, ol, li, pre, code, strong, em, a, blockquote"),
});

const BlogDraft = z.object({
  angle: z.enum(["github_activity", "topic_pool", "tech_news"]),
  slug: z.string().describe("lowercase-kebab-case English slug, max 60 chars"),
  category: z.enum(CATEGORIES),
  tags: z.array(z.string()).describe("3-5 lowercase tags without #"),
  readTimeMinutes: z.number().int(),
  en: LocalizedPost,
  tr: LocalizedPost,
  linkedinPost: z
    .string()
    .describe("English LinkedIn caption: hook line, 3-4 short takeaway lines, a question to readers, 3-5 hashtags. No link (attached separately). Max 1200 chars."),
});

const SYSTEM_PROMPT = `You ghostwrite a weekly technical blog post for a software engineer's personal portfolio. The post is published under their name and shared on their LinkedIn, so it must be accurate and sound like a practitioner, not marketing.

Hard rules:
- Never invent personal experiences, employers, metrics, numbers, quotes or project details. Only state facts about the author that appear in the profile or GitHub activity you are given. When writing from experience you don't have evidence for, write in general technical terms instead.
- News claims must come from the research notes, and the article must link the original sources with <a href> tags.
- Code samples must be correct and minimal. Prefer Java/Spring examples when relevant to the author's stack.
- 900-1400 words in English. The Turkish version is a natural Turkish rewrite (not a literal translation) using common Turkish engineering terminology, keeping English technical terms where Turkish developers normally do.
- No title inside contentHtml (the page renders it). Start with a short intro paragraph.
- Avoid filler phrases, hype words and emoji in the article.`;

function sanitizeHtml(html) {
  return html
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/href\s*=\s*("|')\s*javascript:[^"']*\1/gi, 'href="#"');
}

function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

async function notify(message) {
  if (!process.env.NTFY_TOPIC) return;
  await fetch(`https://ntfy.sh/${process.env.NTFY_TOPIC}`, {
    method: "POST",
    headers: { Title: "Weekly blog draft ready", Click: `${SITE_URL}/admin`, Tags: "memo" },
    body: message,
  }).catch((err) => console.warn("ntfy notification failed", err));
}

async function main() {
  const [profile, existing, githubActivity] = await Promise.all([
    portfolioFetch("/api/profile"),
    DRY_RUN && !ADMIN_TOKEN ? [] : portfolioFetch("/api/blogs"),
    getGithubActivity(),
  ]);
  const { topics } = JSON.parse(fs.readFileSync(path.join(here, "..", "content", "blog-topics.json"), "utf8"));

  const focus = profile.skills.flatMap((s) => s.items).slice(0, 12).join(", ");
  const news = await researchTechNews(focus);

  // Rotate the preferred angle so the blog doesn't become all news or all project updates.
  const preferred = ["github_activity", "topic_pool", "tech_news"][isoWeek(new Date()) % 3];

  const authorContext = {
    name: profile.name,
    title: profile.title,
    bio: profile.about?.bio,
    skills: profile.skills,
    experience: profile.experience?.map(({ company, role, dateRange, responsibilities }) => ({ company, role, dateRange, responsibilities })),
    projects: profile.projects?.map(({ title, description, techStack, githubLink }) => ({ title, description, techStack, githubLink })),
  };

  const userPrompt = `<author_profile>
${JSON.stringify(authorContext, null, 2)}
</author_profile>

<github_activity_last_7_days>
${githubActivity}
</github_activity_last_7_days>

<topic_pool>
${topics.map((t) => `- ${t}`).join("\n")}
</topic_pool>

<tech_news_research>
${news}
</tech_news_research>

<already_published_titles>
${existing.map((b) => `- ${b.title}`).join("\n") || "(none)"}
</already_published_titles>

Write this week's post. Pick ONE angle:
- github_activity: what the author built or learned this week, based strictly on the commits above (only if there is meaningful activity)
- topic_pool: a deep-dive on one topic from the pool that isn't already covered by a published title
- tech_news: an engineer's take on one or two of the news items, with sources

This week's preferred angle is "${preferred}". Use it unless the material for it is thin, in which case choose the strongest alternative. Do not repeat a subject that is already published.`;

  const response = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 20000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    thinking: { type: "adaptive" },
    output_config: { effort: "high", format: betaZodOutputFormat(BlogDraft) },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  if (response.stop_reason === "refusal") throw new Error("Claude declined to write this week's post");
  if (response.stop_reason === "max_tokens") throw new Error("Post generation hit max_tokens; raise the limit");
  const draft = response.parsed_output;
  if (!draft) throw new Error("Claude returned no parseable post");

  const today = new Date();
  const stamp = today.toISOString().slice(0, 10);
  const slugTaken = existing.some((b) => b.slug === draft.slug);

  const post = {
    id: `ai-${stamp}`,
    slug: slugTaken ? `${draft.slug}-${stamp}` : draft.slug,
    title: draft.en.title,
    summary: draft.en.summary,
    content: sanitizeHtml(draft.en.contentHtml),
    tr: { title: draft.tr.title, summary: draft.tr.summary, content: sanitizeHtml(draft.tr.contentHtml) },
    category: draft.category,
    tags: draft.tags,
    readTime: `${draft.readTimeMinutes} min read`,
    date: today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    author: profile.name,
    status: "draft",
    linkedinPost: draft.linkedinPost,
  };

  console.log(`Angle: ${draft.angle} (preferred: ${preferred})`);
  console.log(`Title: ${post.title}`);
  console.log(`Usage: ${JSON.stringify(response.usage)}`);

  if (DRY_RUN) {
    console.log(JSON.stringify(post, null, 2));
    return;
  }

  await portfolioFetch("/api/blogs", { method: "POST", body: JSON.stringify(post) });
  console.log(`Draft saved: ${post.id} -> /blog/${post.slug} (approve it from /admin)`);
  await notify(`"${post.title}" is waiting for your approval.`);

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `## Weekly blog draft\n\n**${post.title}** (${draft.angle})\n\n${post.summary}\n\nApprove at ${SITE_URL}/admin\n`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
