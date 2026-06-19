"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import type { WantToAttend, Team, Venue } from "@/types/venyou";
import { addWishlistItemAction, removeWishlistItemAction } from "@/app/profile/actions";
import { TEAM_HOME_VENUE } from "@/lib/venues";

interface Props {
  initialWishlist: WantToAttend[];
  teams: Team[];
  venues: Venue[];
  isOwner: boolean;
}

interface Pending {
  id: string;
  label: string;
  color?: string;
  sport?: string;
}

export default function WishlistSection({ initialWishlist, teams, venues, isOwner }: Props) {
  const [wishlist, setWishlist] = useState<WantToAttend[]>(initialWishlist);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<Pending | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const existingTeamIds = useMemo(() => new Set(wishlist.map((w) => w.teamId).filter(Boolean)), [wishlist]);

  const filteredTeams = useMemo(() => {
    const q = search.toLowerCase();
    return teams.filter(
      (t) => !existingTeamIds.has(t.id) && (`${t.city} ${t.name}`.toLowerCase().includes(q) || t.abbreviation.toLowerCase().includes(q))
    );
  }, [teams, search, existingTeamIds]);

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
    const result = await addWishlistItemAction({ teamId: pending.id, note: note.trim() });
    setSaving(false);
    if (result.error) { setError(result.error); return; }
    setWishlist((prev) => [...prev, { id: result.id!, userId: "", teamId: pending.id, note: note.trim() }]);
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
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setAdding(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Cancel
            </button>
          </div>

          {pending ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: pending.color ?? "#34d399" }} />
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
                placeholder="Search teams…"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 mb-3"
              />
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredTeams.slice(0, 20).map((t) => {
                  const homeVenue = venues.find((v) => v.id === TEAM_HOME_VENUE[t.id]);
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleSelect({ id: t.id, label: `${t.city} ${t.name}`, color: t.primaryColor, sport: t.sport })}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 text-left transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.primaryColor }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-200">{t.city} {t.name}</p>
                        {homeVenue && <p className="text-xs text-zinc-500">{homeVenue.name}</p>}
                      </div>
                      <span className="text-xs text-zinc-500 shrink-0">{t.sport}</span>
                    </button>
                  );
                })}
                {filteredTeams.length === 0 && (
                  <p className="text-xs text-zinc-500 text-center py-4">No teams found</p>
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
            const homeVenue = team ? venues.find((v) => v.id === TEAM_HOME_VENUE[team.id]) : null;
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
                  {homeVenue && <p className="text-xs text-zinc-500">{homeVenue.name}</p>}
                  {!team && venue && <p className="text-xs text-zinc-500">{venue.city}{venue.state ? `, ${venue.state}` : ""}</p>}
                  {w.note && <p className="text-xs text-zinc-500 italic mt-0.5">{w.note}</p>}
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
