"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      if (!data?.session) {
        setError("Sign in succeeded but no session was created. Check Supabase auth settings.");
        setLoading(false);
        return;
      }
      window.location.href = "/dashboard";
    },
    [email, password]
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
          <h1 className="text-2xl font-black text-zinc-100 mb-1">Welcome back</h1>
          <p className="text-sm text-zinc-500 mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Sign up
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-zinc-600 mt-4 text-center">
            <button className="hover:text-zinc-400 transition-colors">Forgot password?</button>
          </p>
        </div>
      </div>
    </div>
  );
}
