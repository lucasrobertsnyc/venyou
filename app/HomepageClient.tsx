"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

const FEATURES = [
  { title: "Log Games", desc: "Teams, venue, date, score, seats, section. Everything about the day." },
  { title: "Rate the Experience", desc: "9 categories — atmosphere, food, sightlines, entry, parking, and more." },
  { title: "Build Rankings", desc: "Your top stadiums, best rivalries, bucket list venues. Shareable lists." },
  { title: "Track Venues", desc: "Every stadium and arena you've walked into. Your own personal map." },
  { title: "Follow Teams", desc: "Every team you've seen live, across all five major sports." },
  { title: "Compare With Friends", desc: "See what friends have rated. Settle the debate on which arena's better." },
];

const STEPS = [
  { n: "01", title: "Log it", desc: "Pick the game, enter your section, record the final score." },
  { n: "02", title: "Rate it", desc: "Score across 9 experience categories, plus the game itself." },
  { n: "03", title: "Build your passport", desc: "Your full history, stats, and venue log in one place." },
  { n: "04", title: "Share it", desc: "Rankings, scores, and opinions — all yours to show off." },
];

const RANKING_EXAMPLES = [
  { n: 1, title: "My Top 10 Stadiums", tag: "venues" },
  { n: 2, title: "Best College Football Atmospheres", tag: "atmospheres" },
  { n: 3, title: "Best NBA Arenas", tag: "venues" },
  { n: 4, title: "Best Rivalries I've Attended", tag: "games" },
  { n: 5, title: "Best Student Sections", tag: "experiences" },
  { n: 6, title: "Bucket List Stadiums", tag: "venues" },
];

const RATING_ROWS = [
  { label: "Atmosphere", score: 5, bar: 100 },
  { label: "Crowd energy", score: 5, bar: 100 },
  { label: "Seat & view quality", score: 4, bar: 80 },
  { label: "Food & drinks", score: 4, bar: 80 },
  { label: "Entry & security", score: 3, bar: 60 },
  { label: "Parking & transit", score: 3, bar: 60 },
  { label: "Value for money", score: 4, bar: 80 },
];

export default function HomepageClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [bestGame, setBestGame] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* Nav */}
      <nav className="px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-emerald-400 font-black text-lg tracking-tight">Stubs</span>
          <div className="flex items-center gap-8">
            <a href="#features" className="text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300 hidden sm:block transition-colors">Features</a>
            <a href="#waitlist" className="text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300 hidden sm:block transition-colors">Waitlist</a>
            <Link href="/dashboard" className="text-sm font-bold text-emerald-400 border border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-500/10 px-4 py-2 rounded-lg transition-colors">
              Try demo →
            </Link>
          </div>
        </div>
      </nav>

      {/* Sport bar */}
      <div className="border-y border-zinc-800/60 py-3">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-xs text-zinc-600 uppercase tracking-widest hidden sm:block">Sports covered</span>
          <div className="flex gap-6 sm:gap-10">
            {(["NFL","MLB","NBA","NHL","MLS"] as const).map((s, i) => {
              const colors = ["text-blue-400","text-red-400","text-orange-400","text-sky-400","text-green-400"];
              return <span key={s} className={`text-xs font-black tracking-widest ${colors[i]}`}>{s}</span>;
            })}
          </div>
          <span className="text-xs text-zinc-600 uppercase tracking-widest hidden sm:block">Est. 2024</span>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-end">

          {/* Left: headline */}
          <div className="max-w-xl">
            <h1 className="text-5xl lg:text-7xl font-black text-zinc-100 leading-[0.92] tracking-tight mb-8">
              Every game<br />
              you&apos;ve attended<br />
              <span className="text-emerald-400">deserves</span><br />
              a record.
            </h1>
            <p className="text-zinc-400 text-base leading-relaxed mb-10 max-w-sm">
              Log every game. Rate the full experience across 9 categories.
              Build rankings. Track your sports life.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#waitlist"
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-3.5 rounded-lg text-sm transition-colors"
              >
                Join the waitlist
              </a>
              <Link
                href="/dashboard"
                className="border border-zinc-600 hover:border-zinc-400 text-zinc-200 hover:text-zinc-100 font-bold px-7 py-3.5 rounded-lg text-sm transition-colors"
              >
                Try the demo
              </Link>
            </div>
            <p className="text-xs text-zinc-600 mt-3">
              No account needed &mdash;{" "}
              <a href="#how-it-works" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">
                see how it works ↓
              </a>
            </p>
          </div>

          {/* Right: stat block */}
          <div className="grid grid-cols-2 gap-px bg-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden w-full lg:w-auto">
            {[
              { val: "42", label: "Games logged" },
              { val: "9.2", label: "Avg overall score", emerald: true },
              { val: "16", label: "Stadiums visited" },
              { val: "28", label: "Teams seen live" },
            ].map(({ val, label, emerald }) => (
              <div key={label} className="bg-zinc-900 px-8 py-7 lg:px-10 lg:py-8">
                <p className={`text-5xl lg:text-6xl font-black leading-none tabular-nums ${emerald ? "text-emerald-400" : "text-zinc-100"}`}>
                  {val}
                </p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">{label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Demo callout */}
      <section className="border-t border-zinc-800 bg-emerald-950/30">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400 mb-1">Live demo</p>
            <p className="text-lg font-black text-zinc-100">See Stubs in action.</p>
            <p className="text-sm text-zinc-500 mt-1">Explore a fully-loaded dashboard, stats, rankings, and venue pages — no sign-up required.</p>
          </div>
          <Link
            href="/dashboard"
            className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-xl text-sm transition-colors whitespace-nowrap"
          >
            Open the demo →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-[1fr_2fr] gap-16">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400 mb-4">What it does</p>
            <h2 className="text-3xl font-black text-zinc-100 leading-tight">
              The complete toolkit for game-day.
            </h2>
          </div>
          <div className="divide-y divide-zinc-800/70">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="flex gap-6 py-5 first:pt-0">
                <span className="text-xl font-black text-zinc-700 w-8 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 mb-0.5">{f.title}</h3>
                  <p className="text-sm text-zinc-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-zinc-900/40 border-y border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-14">How it works</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800">
            {STEPS.map((s) => (
              <div key={s.n} className="px-0 sm:px-8 py-8 sm:py-0 first:pl-0 last:pr-0">
                <p className="text-7xl font-black text-zinc-800 leading-none mb-5 tabular-nums">{s.n}</p>
                <h3 className="text-base font-bold text-zinc-100 mb-2">{s.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rate what matters */}
      <section className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400 mb-4">Experience ratings</p>
            <h2 className="text-3xl font-black text-zinc-100 leading-tight mb-4">
              Rate what actually matters.
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Not just &quot;was it a good game?&quot; — score the atmosphere,
              the view from your seat, the food, the bathrooms, the parking.
              Nine categories that capture the full picture.
            </p>
          </div>
          {/* Sample rating breakdown */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-baseline justify-between mb-5">
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Chiefs vs. Bills — Jan 21</p>
              <p className="text-2xl font-black text-emerald-400 tabular-nums">9.2<span className="text-sm font-normal text-zinc-500">/10</span></p>
            </div>
            <div className="space-y-3">
              {RATING_ROWS.map(({ label, score, bar }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400 w-32 shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${bar}%` }} />
                  </div>
                  <span className="text-xs font-bold text-zinc-300 w-3 tabular-nums">{score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rankings */}
      <section className="bg-zinc-900/40 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400 mb-4">Rankings</p>
            <h2 className="text-3xl font-black text-zinc-100 leading-tight mb-4">
              Make your sports taste shareable.
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Your top stadiums. Rivalries you&apos;ve witnessed. Your bucket
              list. Create lists, rank them, share them. Your sports opinions,
              finally organized.
            </p>
          </div>
          <div>
            {RANKING_EXAMPLES.map(({ n, title, tag }) => (
              <div key={title} className="flex items-baseline gap-5 py-4 border-b border-zinc-800/50 last:border-0">
                <span className="text-3xl font-black text-zinc-800 w-8 shrink-0 leading-none tabular-nums">{n}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-zinc-200">{title}</span>
                </div>
                <span className="text-xs text-zinc-600 shrink-0">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl font-black text-zinc-100 leading-tight mb-3">
              Get early access.
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Stubs is in early development. Leave your info and
              we&apos;ll reach out when it&apos;s ready. No spam —
              just one email when the doors open.
            </p>
          </div>
          <div>
            {submitted ? (
              <div className="border-l-4 border-emerald-400 pl-6 py-2">
                <p className="text-lg font-bold text-zinc-100">You&apos;re on the list.</p>
                <p className="text-sm text-zinc-400 mt-1">Welcome to Stubs. We&apos;ll be in touch.</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="space-y-3">
                {[
                  { placeholder: "Your name", value: name, onChange: setName, type: "text", required: true },
                  { placeholder: "Email address", value: email, onChange: setEmail, type: "email", required: true },
                  { placeholder: "Favorite team (optional)", value: team, onChange: setTeam, type: "text", required: false },
                ].map(({ placeholder, value, onChange, type, required }) => (
                  <input
                    key={placeholder}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                    className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                ))}
                <textarea
                  placeholder="Best game you&apos;ve ever attended? (optional)"
                  value={bestGame}
                  onChange={(e) => setBestGame(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-lg text-sm transition-colors"
                >
                  Join the waitlist
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-emerald-400 font-black text-sm">Stubs</span>
            <p className="text-xs text-zinc-600 mt-1 uppercase tracking-widest">Track · Rate · Rank · Relive</p>
          </div>
          <div className="flex gap-8 text-xs text-zinc-600 uppercase tracking-widest">
            <a href="#features" className="hover:text-zinc-400 transition-colors">Features</a>
            <a href="#waitlist" className="hover:text-zinc-400 transition-colors">Waitlist</a>
            <Link href="/dashboard" className="hover:text-zinc-400 transition-colors">Demo</Link>
          </div>
          <p className="text-xs text-zinc-700 uppercase tracking-widest">Built for fans.</p>
        </div>
      </footer>

    </div>
  );
}
