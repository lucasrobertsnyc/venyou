"use client";

import { useState, useMemo, useCallback } from "react";
import type { Ranking, Team, Venue, Game } from "@/types/venyou";

interface DraftItem {
  refId: string;
  refType: "team" | "venue" | "game";
  label: string;
  note: string;
}

interface Props {
  teams: Team[];
  venues: Venue[];
  games: Game[];
  editing?: Ranking;
  onSave: (title: string, description: string, items: DraftItem[]) => Promise<void>;
  onClose: () => void;
}

type Tab = "team" | "venue" | "game";

function gameLabel(game: Game, teams: Team[]): string {
  const home = teams.find((t) => t.id === game.homeTeamId);
  const away = teams.find((t) => t.id === game.awayTeamId);
  const h = home?.abbreviation ?? game.homeTeamName ?? "?";
  const a = away?.abbreviation ?? game.awayTeamName ?? "?";
  return `${a} @ ${h} · ${game.date}`;
}

export default function CreateRankingModal({ teams, venues, games, editing, onSave, onClose }: Props) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Draft items — rank is derived from position
  const [items, setItems] = useState<DraftItem[]>(() => {
    if (!editing) return [];
    return [...editing.items]
      .sort((a, b) => a.rank - b.rank)
      .map((item) => {
        let label = item.refId;
        if (item.refType === "team") {
          const t = teams.find((t) => t.id === item.refId);
          if (t) label = `${t.city} ${t.name}`;
        } else if (item.refType === "venue") {
          const v = venues.find((v) => v.id === item.refId);
          if (v) label = v.name;
        } else {
          const g = games.find((g) => g.id === item.refId);
          if (g) label = gameLabel(g, teams);
        }
        return { refId: item.refId, refType: item.refType, label, note: item.note };
      });
  });

  // Picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("team");
  const [search, setSearch] = useState("");
  const [pendingItem, setPendingItem] = useState<Omit<DraftItem, "note"> | null>(null);
  const [pendingNote, setPendingNote] = useState("");

  const addedIds = useMemo(() => new Set(items.map((i) => i.refId)), [items]);

  const filteredTeams = useMemo(() => {
    const q = search.toLowerCase();
    return teams.filter(
      (t) =>
        !addedIds.has(t.id) &&
        (`${t.city} ${t.name}`.toLowerCase().includes(q) || t.abbreviation.toLowerCase().includes(q))
    );
  }, [teams, search, addedIds]);

  const filteredVenues = useMemo(() => {
    const q = search.toLowerCase();
    return venues.filter((v) => !addedIds.has(v.id) && v.name.toLowerCase().includes(q));
  }, [venues, search, addedIds]);

  const filteredGames = useMemo(() => {
    const q = search.toLowerCase();
    return games.filter((g) => !addedIds.has(g.id) && gameLabel(g, teams).toLowerCase().includes(q)).slice(0, 30);
  }, [games, teams, search, addedIds]);

  const handlePickItem = useCallback((id: string, type: Tab, label: string) => {
    setPendingItem({ refId: id, refType: type, label });
    setPendingNote("");
  }, []);

  const handleConfirmAdd = useCallback(() => {
    if (!pendingItem) return;
    setItems((prev) => [...prev, { ...pendingItem, note: pendingNote.trim() }]);
    setPendingItem(null);
    setPendingNote("");
    setSearch("");
  }, [pendingItem, pendingNote]);

  const handleRemove = useCallback((idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleMoveUp = useCallback((idx: number) => {
    if (idx === 0) return;
    setItems((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }, []);

  const handleMoveDown = useCallback((idx: number) => {
    setItems((prev) => {
      if (idx === prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!title.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      await onSave(title, description, items);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Something went wrong.");
      setSaving(false);
    }
  }, [title, description, items, onSave]);

  const TAB_LABELS: Record<Tab, string> = { team: "Teams", venue: "Venues", game: "Games" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-base font-bold text-zinc-100">
            {editing ? "Edit Ranking" : "Create Ranking"}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors text-xl leading-none">×</button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Best Stadiums I've Visited"
              autoFocus
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Description <span className="normal-case font-normal text-zinc-600">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this ranking about?"
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          {/* Items list */}
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Items</p>

            {items.length === 0 && !pickerOpen && (
              <p className="text-xs text-zinc-600 mb-3">No items yet — add some below.</p>
            )}

            {items.length > 0 && (
              <ol className="space-y-2 mb-3">
                {items.map((item, idx) => (
                  <li key={`${item.refId}-${idx}`} className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5">
                    <span className="text-xs font-black text-zinc-500 w-5 shrink-0">{idx + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-100 truncate">{item.label}</p>
                      {item.note && <p className="text-xs text-zinc-500 italic truncate">{item.note}</p>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-300 disabled:opacity-20 transition-colors"
                        title="Move up"
                      >
                        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === items.length - 1}
                        className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-300 disabled:opacity-20 transition-colors"
                        title="Move down"
                      >
                        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleRemove(idx)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-red-400 transition-colors text-base leading-none"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {/* Add item picker */}
            {!pickerOpen ? (
              <button
                onClick={() => { setPickerOpen(true); setSearch(""); setPendingItem(null); }}
                className="w-full border border-dashed border-zinc-700 hover:border-emerald-600 text-zinc-500 hover:text-emerald-400 rounded-xl py-2.5 text-sm font-semibold transition-colors"
              >
                + Add Item
              </button>
            ) : (
              <div className="border border-zinc-700 rounded-xl overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-zinc-700">
                  {(["team", "venue", "game"] as Tab[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTab(t); setSearch(""); setPendingItem(null); }}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                        tab === t
                          ? "bg-zinc-800 text-zinc-100 border-b-2 border-emerald-500"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {TAB_LABELS[t]}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="px-3 pt-3 pb-2">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPendingItem(null); }}
                    placeholder={`Search ${TAB_LABELS[tab].toLowerCase()}…`}
                    autoFocus
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Results */}
                <div className="max-h-40 overflow-y-auto px-2 pb-2">
                  {tab === "team" && filteredTeams.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handlePickItem(t.id, "team", `${t.city} ${t.name}`)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                        pendingItem?.refId === t.id ? "bg-emerald-900/40 text-emerald-300" : "hover:bg-zinc-700 text-zinc-300"
                      }`}
                    >
                      <span className="font-bold w-8 shrink-0" style={{ color: t.primaryColor }}>{t.abbreviation}</span>
                      <span className="truncate">{t.city} {t.name}</span>
                    </button>
                  ))}
                  {tab === "venue" && filteredVenues.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => handlePickItem(v.id, "venue", v.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                        pendingItem?.refId === v.id ? "bg-emerald-900/40 text-emerald-300" : "hover:bg-zinc-700 text-zinc-300"
                      }`}
                    >
                      {v.name} <span className="text-zinc-500">· {v.city}</span>
                    </button>
                  ))}
                  {tab === "game" && filteredGames.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handlePickItem(g.id, "game", gameLabel(g, teams))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                        pendingItem?.refId === g.id ? "bg-emerald-900/40 text-emerald-300" : "hover:bg-zinc-700 text-zinc-300"
                      }`}
                    >
                      {gameLabel(g, teams)}
                    </button>
                  ))}
                  {tab === "team" && filteredTeams.length === 0 && (
                    <p className="text-xs text-zinc-600 px-3 py-2">No teams found.</p>
                  )}
                  {tab === "venue" && filteredVenues.length === 0 && (
                    <p className="text-xs text-zinc-600 px-3 py-2">No venues found.</p>
                  )}
                  {tab === "game" && filteredGames.length === 0 && (
                    <p className="text-xs text-zinc-600 px-3 py-2">No games found.</p>
                  )}
                </div>

                {/* Selected item + note */}
                {pendingItem && (
                  <div className="border-t border-zinc-700 px-3 py-3 space-y-2">
                    <p className="text-xs font-semibold text-emerald-400 truncate">+ {pendingItem.label}</p>
                    <input
                      type="text"
                      value={pendingNote}
                      onChange={(e) => setPendingNote(e.target.value)}
                      placeholder="Optional note…"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleConfirmAdd(); } }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleConfirmAdd}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold py-1.5 rounded-lg transition-colors"
                      >
                        Add to list
                      </button>
                      <button
                        onClick={() => { setPendingItem(null); setPendingNote(""); }}
                        className="px-3 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Close picker */}
                <div className="border-t border-zinc-700 px-3 py-2">
                  <button
                    onClick={() => { setPickerOpen(false); setPendingItem(null); }}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Done adding
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between gap-3">
          {saveError && <p className="text-xs text-red-400 flex-1">{saveError}</p>}
          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-semibold px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || saving}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-2 rounded-xl transition-colors"
            >
              {saving ? "Saving…" : editing ? "Save Changes" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
