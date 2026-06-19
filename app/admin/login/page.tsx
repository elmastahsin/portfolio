"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Terminal, ShieldAlert, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Initializing secure connection to gatekeeper...",
    "SSH-2.0-OpenSSH_9.0p1 Ubuntu-3ubuntu1.3",
    "Warning: Unauthorised access is strictly prohibited."
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, skip login screen
    if (localStorage.getItem("admin_session") === "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("AUTHENTICATION_FAILED: Missing parameters");
      return;
    }

    setLoading(true);
    setError("");
    
    // Add command to terminal history
    setTerminalHistory((prev) => [
      ...prev,
      `admin@portfolio:~$ login -u ${username} -p **********`
    ]);

    setTimeout(() => {
      const expectedUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
      const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin";

      if (username === expectedUsername && password === expectedPassword) {
        setTerminalHistory((prev) => [...prev, "Access GRANTED.", "Establishing terminal session..."]);
        localStorage.setItem("admin_session", "true");
        setTimeout(() => {
          router.push("/admin");
        }, 800);
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          "ACCESS DENIED: Invalid credential tokens.",
          "Connection closed."
        ]);
        setError("AUTHENTICATION_FAILED: Credentials rejected");
        setPassword("");
        setLoading(false);
      }
    }, 1200);
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
        <div className="rounded-xl border border-border-color bg-bg-secondary shadow-card overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-bg-tertiary border-b border-border-color">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="font-mono text-xs font-semibold text-text-tertiary select-none flex items-center gap-1">
              <Terminal size={12} className="text-accent-primary" />
              secure-ssh-login.sh
            </span>
            <div className="w-12" /> {/* Spacer */}
          </div>

          {/* Terminal Console View */}
          <div className="p-5 font-mono text-[11px] bg-bg-primary text-text-secondary h-44 overflow-y-auto space-y-1 border-b border-border-color select-none">
            {terminalHistory.map((line, idx) => (
              <p key={idx} className={line.includes("DENIED") || line.includes("FAILED") ? "text-red-500" : line.includes("GRANTED") ? "text-emerald-500 animate-pulse" : ""}>
                {line}
              </p>
            ))}
            {loading && (
              <p className="text-accent-primary animate-pulse">// Authenticating client keys...</p>
            )}
          </div>

          {/* Form inputs */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs animate-fade-in font-mono">
                <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="user" className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                Username
              </label>
              <input
                type="text"
                id="user"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm font-mono focus:outline-none focus:ring-1 focus:ring-accent-primary focus:border-accent-primary disabled:opacity-50 transition-all duration-200"
                placeholder="e.g. admin"
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="pass" className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                Access Token / Passphrase
              </label>
              <input
                type="password"
                id="pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm font-mono focus:outline-none focus:ring-1 focus:ring-accent-primary focus:border-accent-primary disabled:opacity-50 transition-all duration-200"
                placeholder="e.g. admin"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-mono flex items-center justify-center gap-2 mt-2"
            >
              {loading ? "Verifying..." : "Initialize Session"}
            </Button>
          </form>
        </div>

        {!process.env.NEXT_PUBLIC_ADMIN_USERNAME && (
          <p className="text-center font-mono text-[9px] text-text-tertiary mt-4">
            // Hint: default credentials are Username: <span className="text-accent-primary">admin</span> | Pass: <span className="text-accent-primary">admin</span>
          </p>
        )}
      </div>
    </div>
  );
}
