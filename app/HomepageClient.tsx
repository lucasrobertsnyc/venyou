"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a3 3 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" /></svg>
    ),
    title: "Log Games",
    desc: "Teams, venue, date, score, seats, and your section.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
    ),
    title: "Rate the Experience",
    desc: "Score atmosphere, view, food, entry, crowd energy, and more.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
    ),
    title: "Build Rankings",
    desc: "Rank your best stadiums, rivalries, and away trips.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
    ),
    title: "Track Venues",
    desc: "A personal map of every stadium and arena you've visited.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
    ),
    title: "Compare With Friends",
    desc: "See where friends have been and what they rated highly.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
    ),
    title: "Follow Teams",
    desc: "Track every team you've seen live across all 5 major sports.",
  },
];

const RATING_CHIPS = [
  "Overall experience", "Atmosphere", "Crowd energy",
  "Seat & view quality", "Food & drinks", "Entry & security",
  "Bathrooms & lines", "Parking & transit", "Value for money",
];

const RANKING_EXAMPLES = [
  "My Top 10 Stadiums",
  "Best College Football Atmospheres",
  "Best NBA Arenas",
  "Best Rivalries I've Attended",
  "Best Student Sections",
  "Bucket List Stadiums",
];

const STEPS = [
  { n: "1", title: "Log a game", desc: "Record the teams, venue, date, score, and your seat." },
  { n: "2", title: "Rate the experience", desc: "Score across 9 categories — from atmosphere to parking." },
  { n: "3", title: "Build your sports passport", desc: "Your full history, stats, and venue map in one place." },
  { n: "4", title: "Discover what's next", desc: "See friend ratings and find games worth attending." },
];

export default function HomepageClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [bestGame, setBestGame] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
    },
    []
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Nav */}
      <nav className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-black text-xl tracking-tight">VenYou</span>
            <span className="text-zinc-600 text-xs hidden sm:block">Track. Rate. Rank. Relive.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm text-zinc-400 hover:text-zinc-100 hidden sm:block">Features</a>
            <a href="#waitlist" className="text-sm text-zinc-400 hover:text-zinc-100 hidden sm:block">Waitlist</a>
            <Link
              href="/dashboard"
              className="text-sm bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-full font-semibold transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              Now accepting early access
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-zinc-100 leading-tight mb-4">
              The social sports passport for every game{" "}
              <span className="text-emerald-400">you&apos;ve been to.</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed mb-8">
              Log every game, rate the full experience, build your rankings, and compare your sports life with friends.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#waitlist"
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-full transition-colors"
              >
                Join the Waitlist
              </a>
              <a
                href="#how-it-works"
                className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold px-6 py-3 rounded-full transition-colors"
              >
                See How It Works
              </a>
            </div>
          </div>

          {/* Fake mobile mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-72 bg-zinc-900 border border-zinc-700 rounded-3xl p-1 shadow-2xl shadow-zinc-950">
              <div className="bg-zinc-800 rounded-2xl p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500">Sports Passport</p>
                    <p className="text-sm font-bold text-zinc-100">Alex&apos;s Sports Passport</p>
                  </div>
                  <span className="text-emerald-400 font-black text-xs">VenYou</span>
                </div>
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Games Logged", val: "42" },
                    { label: "Stadiums", val: "16" },
                    { label: "Teams Seen", val: "28" },
                  ].map((s) => (
                    <div key={s.label} className="bg-zinc-900 rounded-xl p-2 text-center">
                      <p className="text-xl font-black text-emerald-400">{s.val}</p>
                      <p className="text-xs text-zinc-500 leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
                {/* Recent log */}
                <div className="bg-zinc-900 rounded-xl p-3">
                  <p className="text-xs text-zinc-500 mb-1">Recent Log</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-zinc-100">Chiefs vs. Bills</p>
                      <p className="text-xs text-zinc-500">Arrowhead Stadium · Jan 21</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-emerald-400">9.2</p>
                      <p className="text-xs text-zinc-500">overall</p>
                    </div>
                  </div>
                </div>
                {/* Fav venue */}
                <div className="flex items-center justify-between bg-zinc-900 rounded-xl px-3 py-2">
                  <div>
                    <p className="text-xs text-zinc-500">Favorite Venue</p>
                    <p className="text-xs font-semibold text-zinc-100">Arrowhead Stadium</p>
                  </div>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-400" fill="currentColor"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
                </div>
                {/* Sport badges */}
                <div className="flex gap-1 flex-wrap">
                  {["NFL", "MLB", "NBA", "NHL", "MLS"].map((s, i) => {
                    const colors = ["bg-blue-500", "bg-red-500", "bg-orange-500", "bg-sky-400", "bg-green-500"];
                    return (
                      <span key={s} className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${colors[i]}`}>
                        {s}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-black text-zinc-100 text-center mb-2">
          Everything for the serious sports fan
        </h2>
        <p className="text-zinc-400 text-center mb-12">Your whole sports life, in one place.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
            >
              <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 mb-3">
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-zinc-100 mb-1">{f.title}</h3>
              <p className="text-sm text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-zinc-900 border-y border-zinc-800 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-black text-zinc-100 text-center mb-2">How it works</h2>
          <p className="text-zinc-400 text-center mb-12">Four steps to your complete sports passport.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-black text-xl mx-auto mb-4">
                  {s.n}
                </div>
                <h3 className="text-sm font-bold text-zinc-100 mb-1">{s.title}</h3>
                <p className="text-sm text-zinc-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rating categories */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-black text-zinc-100 text-center mb-2">
          Rate what actually matters.
        </h2>
        <p className="text-zinc-400 text-center mb-10">
          9 categories that capture the full game-day experience.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {RATING_CHIPS.map((chip) => (
            <span
              key={chip}
              className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm px-4 py-2 rounded-full hover:border-emerald-500 transition-colors"
            >
              {chip}
            </span>
          ))}
        </div>
      </section>

      {/* Rankings showcase */}
      <section className="bg-zinc-900 border-y border-zinc-800 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-black text-zinc-100 text-center mb-2">
            Make your sports taste shareable.
          </h2>
          <p className="text-zinc-400 text-center mb-10">
            Build ranking lists that show your sports identity.
          </p>
          <div className="max-w-sm mx-auto space-y-2">
            {RANKING_EXAMPLES.map((title, i) => (
              <div
                key={title}
                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <span className="text-sm font-bold text-zinc-500 w-4">{i + 1}.</span>
                <span className="text-sm font-semibold text-zinc-100">{title}</span>
                <span className="ml-auto text-xs text-emerald-400 font-semibold">ranking</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-black text-zinc-100 mb-2">Join the waitlist.</h2>
          <p className="text-zinc-400 mb-8">Be first when VenYou launches. We&apos;ll reach out when early access opens.</p>

          {submitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-emerald-400 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-base font-bold text-zinc-100">You&apos;re on the list. Welcome to VenYou.</p>
              <p className="text-sm text-zinc-400 mt-2">We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="space-y-3 text-left">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Favorite team"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              <textarea
                placeholder="Best game you've ever attended?"
                value={bestGame}
                onChange={(e) => setBestGame(e.target.value)}
                rows={2}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Join the Waitlist
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-emerald-400 font-black text-base">VenYou</span>
            <span className="text-zinc-600 text-xs ml-3">Track. Rate. Rank. Relive.</span>
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#features" className="hover:text-zinc-300">Features</a>
            <a href="#waitlist" className="hover:text-zinc-300">Waitlist</a>
            <a href="#waitlist" className="hover:text-zinc-300">Contact</a>
          </div>
          <p className="text-xs text-zinc-600">Built for sports fans.</p>
        </div>
      </footer>
    </div>
  );
}
