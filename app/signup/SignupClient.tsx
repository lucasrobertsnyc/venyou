"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupClient() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleUsernameChange = useCallback((val: string) => {
    setUsername(val.toLowerCase().replace(/[^a-z0-9_]/g, ""));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (username.length < 3) {
        setError("Username must be at least 3 characters.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }

      setLoading(true);
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, display_name: displayName },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // If a session came back, email confirmation is disabled — go straight to dashboard
      if (data.session) {
        window.location.href = "/dashboard";
        return;
      }

      // Otherwise email confirmation is required — show the check-your-email screen
      setDone(true);
    },
    [displayName, username, email, password]
  );

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <nav className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="text-emerald-400 font-black text-lg tracking-tight">Stubs</Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {done ? (
            <div className="border-l-4 border-emerald-400 pl-6 py-2">
              <p className="text-lg font-bold text-zinc-100">Check your email.</p>
              <p className="text-sm text-zinc-400 mt-1">
                We sent a confirmation link to <span className="text-zinc-200">{email}</span>. Click
                it to activate your account.
              </p>
              <p className="text-xs text-zinc-600 mt-3">
                You can disable email confirmation in your Supabase Auth settings for local dev.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-zinc-100 mb-1">Create your account</h1>
              <p className="text-sm text-zinc-500 mb-8">
                Already have one?{" "}
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Sign in
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
                <div>
                  <input
                    type="text"
                    placeholder="Username (letters, numbers, _)"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    required
                    minLength={3}
                    className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                  {username && (
                    <p className="text-xs text-zinc-600 mt-1 ml-1">@{username}</p>
                  )}
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
                <input
                  type="password"
                  placeholder="Password (min 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
                {error && (
                  <p className="text-sm text-red-400 border border-red-900/50 bg-red-950/30 rounded-lg px-4 py-2.5">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-sm transition-colors"
                >
                  {loading ? "Creating account…" : "Create account"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
