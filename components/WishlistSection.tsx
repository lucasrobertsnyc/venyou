"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import type { WantToAttend, Team, Venue } from "@/types/venyou";
import { addWishlistItemAction, removeWishlistItemAction } from "@/app/profile/actions";

interface Props {
  initialWishlist: WantToAttend[];
  teams: Team[];
  venues: Venue[];
  isOwner: boolean;
}

type Tab = "teams" | "venues";

interface Pending {
  type: "team" | "venue";
  id: string;
  label: string;
  color?: string;
  sport?: string;
}

export default function WishlistSection({ initialWishlist, teams, venues, isOwner }: Props) {
  const [wishlist, setWishlist] = useState<WantToAttend[]>(initialWishlist);
  const [adding, setAdding] = useState(false);
  const [tab, setTab] = useState<Tab>("teams");
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<Pending | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const existingTeamIds = useMemo(() => new Set(wishlist.map((w) => w.teamId).filter(Boolean)), [wishlist]);
  const existingVenueIds = useMemo(() => new Set(wishlist.map((w) => w.venueId).filter(Boolean)), [wishlist]);

  const filteredTeams = useMemo(() => {
    const q = search.toLowerCase();
    return teams.filter(
      (t) => !existingTeamIds.has(t.id) && (`${t.city} ${t.name}`.toLowerCase().includes(q) || t.abbreviation.toLowerCase().includes(q))
    );
  }, [teams, search, existingTeamIds]);

  const filteredVenues = useMemo(() => {
    const q = search.toLowerCase();
    return venues.filter(
      (v) => !existingVenueIds.has(v.id) && (v.name.toLowerCase().includes(q) || v.city.toLowerCase().includes(q))
    );
  }, [venues, search, existingVenueIds]);

  const openAdd = useCallback(() => {
    setAdding(true);
    setSearch("");
    setPending(null);
    setNote("");
    setError(null);
    setTimeout(() => searchRef.current?.focus(), 50);
  }, []);

  const handleSelect = useCallback((p: Pending) => {
    setPending(p);
    setNote("");
    setError(null);
  }, []);

  const handleAdd = useCallback(async () => {
    if (!pending) return;
    setSaving(true);
    setError(null);
    const result = await addWishlistItemAction({
      teamId: pending.type === "team" ? pending.id : undefined,
      venueId: pending.type === "venue" ? pending.id : undefined,
      note: note.trim(),
    });
    setSaving(false);
    if (result.error) { setError(result.error); return; }
    const newItem: WantToAttend = {
      id: result.id!,
      userId: "",
      teamId: pending.type === "team" ? pending.id : undefined,
      venueId: pending.type === "venue" ? pending.id : undefined,
      note: note.trim(),
    };
    setWishlist((prev) => [...prev, newItem]);
    setPending(null);
    setNote("");
    setSearch("");
    setAdding(false);
  }, [pending, note]);

  const handleRemove = useCallback(async (itemId: string) => {
    setWishlist((prev) => prev.filter((w) => w.id !== itemId));
    await removeWishlistItemAction(itemId);
  }, []);

  return (
    <div>
      <div id="wishlist" className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Wishlist</h2>
        {isOwner && !adding && (
          <button
            onClick={openAdd}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            + Add
          </button>
        )}
      </div>

      {/* Add panel */}
      {adding && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4">
          {/* Tabs */}
          <div className="flex gap-1 mb-3">
            {(["teams", "venues"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setSearch(""); setPending(null); }}
                className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors capitalize ${
                  tab === t ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {t}
              </button>
            ))}
            <button
              onClick={() => setAdding(false)}
              className="ml-auto text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Pending selection */}
          {pending ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: pending.color ?? "#34d399" }}
                />
                <span className="text-sm font-medium text-zinc-100 flex-1">{pending.label}</span>
                {pending.sport && <span className="text-xs text-zinc-500">{pending.sport}</span>}
                <button onClick={() => setPending(null)} className="text-zinc-500 hover:text-zinc-300 text-sm leading-none">×</button>
              </div>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note (optional)"
                maxLength={120}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={saving}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                >
                  {saving ? "Adding…" : "Add to wishlist"}
                </button>
                <button
                  onClick={() => setPending(null)}
                  className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold py-2 rounded-lg transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            <>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${tab}…`}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 mb-3"
              />
              <div className="max-h-48 overflow-y-auto space-y-1">
                {tab === "teams"
                  ? filteredTeams.slice(0, 20).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleSelect({ type: "team", id: t.id, label: `${t.city} ${t.name}`, color: t.primaryColor, sport: t.sport })}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 text-left transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.primaryColor }} />
                        <span className="text-sm text-zinc-200 flex-1">{t.city} {t.name}</span>
                        <span className="text-xs text-zinc-500">{t.sport}</span>
                      </button>
                    ))
                  : filteredVenues.slice(0, 20).map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleSelect({ type: "venue", id: v.id, label: v.name, color: "#34d399" })}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 text-left transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <span className="text-sm text-zinc-200 flex-1">{v.name}</span>
                        <span className="text-xs text-zinc-500">{v.city}</span>
                      </button>
                    ))}
                {tab === "teams" && filteredTeams.length === 0 && (
                  <p className="text-xs text-zinc-500 text-center py-4">No teams found</p>
                )}
                {tab === "venues" && filteredVenues.length === 0 && (
                  <p className="text-xs text-zinc-500 text-center py-4">No venues found</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Wishlist items */}
      {wishlist.length > 0 ? (
        <div className="space-y-2">
          {wishlist.map((w) => {
            const team = w.teamId ? teams.find((t) => t.id === w.teamId) : null;
            const venue = w.venueId ? venues.find((v) => v.id === w.venueId) : null;
            return (
              <div key={w.id} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 flex items-center gap-3 group">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: team?.primaryColor ?? "#34d399" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-100">
                    {team ? `${team.city} ${team.name}` : venue?.name ?? "Unknown"}
                  </p>
                  {w.note && <p className="text-xs text-zinc-500 italic">{w.note}</p>}
                </div>
                {team && <span className="text-xs font-bold text-zinc-500">{team.sport}</span>}
                {isOwner && (
                  <button
                    onClick={() => handleRemove(w.id)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all text-sm leading-none ml-1"
                    title="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : !adding ? (
        <p className="text-zinc-500 text-sm text-center py-8">
          {isOwner ? "Nothing on your wishlist yet." : "No wishlist yet."}
        </p>
      ) : null}
    </div>
  );
}
