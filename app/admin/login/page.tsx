"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Terminal, ArrowLeft } from "lucide-react";

// Where to go after login: only same-site paths, never "//host" or "/\\host" (open redirect).
function nextPath(): string | null {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : null;
}

// /admin/learn/ is a route handler, not a page, so it needs a full navigation
function goNext(router: ReturnType<typeof useRouter>) {
  const next = nextPath();
  if (next) window.location.assign(next);
  else router.push("/admin");
}

export default function AdminLoginPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  const [username, setUsername] = useState("");
  const [loginStep, setLoginStep] = useState<"username" | "password" | "verifying" | "success">("username");
  const [inputValue, setInputValue] = useState("");
  
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Initializing secure connection to gatekeeper...",
    "SSH-2.0-OpenSSH_9.0p1 Ubuntu-3ubuntu1.3",
    "Warning: Unauthorised access is strictly prohibited.",
    ""
  ]);

  useEffect(() => {
    // If token exists, verify with server before skipping login
    const token = localStorage.getItem("admin_token");
    if (token) {
      fetch("/api/auth", {
        headers: { Authorization: token },
      })
        .then((res) => {
          if (res.ok) {
            localStorage.setItem("admin_session", "true");
            goNext(router);
          } else {
            localStorage.removeItem("admin_session");
            localStorage.removeItem("admin_token");
          }
        })
        .catch(() => {
          localStorage.removeItem("admin_session");
        });
    }
  }, [router]);

  // Focus input on load
  useEffect(() => {
    focusInput();
  }, []);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [terminalHistory, inputValue, loginStep]);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const verifyCredentials = async (userVal: string, passVal: string) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userVal, password: passVal }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        setTerminalHistory((prev) => [
          ...prev,
          "Access GRANTED.",
          "Establishing secure shell session...",
          "System loading completed.",
        ]);
        localStorage.setItem("admin_session", "true");
        localStorage.setItem("admin_token", data.token);
        setLoginStep("success");
        setTimeout(() => goNext(router), 800);
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          `ACCESS DENIED: ${data.error || "Invalid credential tokens."}`,
          "Connection closed.",
          "",
        ]);
        setLoginStep("username");
        setUsername("");
        setInputValue("");
      }
    } catch (e) {
      setTerminalHistory((prev) => [
        ...prev,
        "ACCESS ERROR: System login service unavailable.",
        "Connection closed.",
        "",
      ]);
      setLoginStep("username");
      setUsername("");
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = inputValue;

      if (loginStep === "username") {
        const trimmedUser = value.trim();
        if (!trimmedUser) return;
        
        setUsername(trimmedUser);
        setTerminalHistory((prev) => [...prev, `portfolio login: ${trimmedUser}`]);
        setLoginStep("password");
        setInputValue("");
      } else if (loginStep === "password") {
        setTerminalHistory((prev) => [...prev, `Password: ${"•".repeat(value.length)}`]);
        setLoginStep("verifying");
        setInputValue("");
        verifyCredentials(username, value);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-primary px-6 relative">
      {/* Back button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-xs font-mono text-text-secondary hover:text-accent-primary cursor-pointer active:scale-95 transition-all"
      >
        <ArrowLeft size={14} />
        &lt;Back to Home /&gt;
      </button>

      <div className="w-full max-w-md animate-fade-in z-10">
        {/* Terminal Window Wrapper */}
        <div
          onClick={focusInput}
          className="rounded-xl border border-border-color bg-bg-secondary shadow-card overflow-hidden cursor-text active:border-accent-primary/60 focus-within:border-accent-primary/60 transition-all duration-300"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-bg-tertiary border-b border-border-color select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="font-mono text-xs font-semibold text-text-tertiary flex items-center gap-1">
              <Terminal size={12} className="text-accent-primary" />
              secure-ssh-login.sh
            </span>
            <div className="w-12" /> {/* Spacer */}
          </div>

          {/* Terminal Console View */}
          <div
            ref={consoleRef}
            className="p-6 font-mono text-[11px] bg-bg-primary text-text-secondary h-72 overflow-y-auto relative"
          >
            <input
              ref={inputRef}
              type={loginStep === "password" ? "password" : "text"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="absolute w-px h-px opacity-0 pointer-events-none select-none"
              autoFocus
              autoComplete="off"
              disabled={loginStep === "verifying" || loginStep === "success"}
            />

            <div className="space-y-1.5">
              {terminalHistory.map((line, idx) => {
                let colorClass = "";
                if (line.includes("DENIED")) colorClass = "text-red-500 font-bold";
                else if (line.includes("GRANTED")) colorClass = "text-emerald-500 font-bold animate-pulse";
                else if (line.startsWith("Initializing") || line.startsWith("Warning")) colorClass = "text-text-tertiary";

                return (
                  <p key={idx} className={colorClass}>
                    {line}
                  </p>
                );
              })}

              {/* Active Prompt Line */}
              {loginStep === "username" && (
                <p className="flex items-center">
                  <span className="text-text-secondary">portfolio login:&nbsp;</span>
                  <span className="text-text-primary font-bold">{inputValue}</span>
                  <span className="w-1.5 h-3.5 bg-accent-primary animate-pulse ml-0.5" />
                </p>
              )}

              {loginStep === "password" && (
                <p className="flex items-center">
                  <span className="text-text-secondary">Password:&nbsp;</span>
                  <span className="text-text-primary font-bold">{"•".repeat(inputValue.length)}</span>
                  <span className="w-1.5 h-3.5 bg-accent-primary animate-pulse ml-0.5" />
                </p>
              )}

              {loginStep === "verifying" && (
                <p className="text-accent-primary animate-pulse font-medium">
                  // Authenticating client credentials...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Hints and helper text below the terminal */}
        <div className="flex flex-col gap-1.5 mt-4 text-center">
          <p className="font-mono text-[9px] text-text-tertiary select-none">
            // Tap the terminal screen to focus and type. Press Enter to submit.
          </p>
        </div>
      </div>
    </div>
  );
}
