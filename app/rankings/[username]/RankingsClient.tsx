"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Ranking, User, Team, Venue, Game, RankingItem } from "@/types/venyou";
import RankingCard from "@/components/RankingCard";
import CreateRankingModal from "@/components/CreateRankingModal";
import { createRankingAction, updateRankingAction, deleteRankingAction } from "@/app/rankings/actions";

interface DraftItem {
  refId: string;
  refType: "team" | "venue" | "game";
  label: string;
  note: string;
}

interface Props {
  rankings: Ranking[];
  user: User;
  teams: Team[];
  venues: Venue[];
  games: Game[];
  isOwner: boolean;
}

export default function RankingsClient({ rankings: initialRankings, user, teams, venues, games, isOwner }: Props) {
  const router = useRouter();
  const [rankings, setRankings] = useState<Ranking[]>(initialRankings);
  const [showModal, setShowModal] = useState(false);
  const [editingRanking, setEditingRanking] = useState<Ranking | null>(null);

  useEffect(() => { setRankings(initialRankings); }, [initialRankings]);

  const handleSave = useCallback(async (title: string, description: string, items: DraftItem[]) => {
    const mappedItems = items.map((item, i) => ({
      refId: item.refId,
      refType: item.refType as RankingItem["refType"],
      note: item.note,
      rank: i + 1,
    }));

    if (editingRanking) {
      const result = await updateRankingAction(editingRanking.id, { title, description, items: mappedItems });
      if (result.error) throw new Error(result.error);
      setRankings((prev) =>
        prev.map((r) =>
          r.id === editingRanking.id
            ? { ...r, title, description, items: mappedItems }
            : r
        )
      );
    } else {
      const result = await createRankingAction({ title, description, items: mappedItems });
      if (result.error) throw new Error(result.error);
      const newRanking: Ranking = {
        id: result.id!,
        userId: user.id,
        title,
        description,
        items: mappedItems,
        createdAt: new Date().toISOString(),
      };
      setRankings((prev) => [newRanking, ...prev]);
    }

    setShowModal(false);
    setEditingRanking(null);
    router.refresh();
  }, [editingRanking, user.id, router]);

  const handleEdit = useCallback((ranking: Ranking) => {
    setEditingRanking(ranking);
    setShowModal(true);
  }, []);

  const handleDelete = useCallback(async (rankingId: string) => {
    if (!confirm("Delete this ranking?")) return;
    setRankings((prev) => prev.filter((r) => r.id !== rankingId));
    await deleteRankingAction(rankingId);
    router.refresh();
  }, [router]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setEditingRanking(null);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800 px-6 py-4 sticky top-0 z-10 bg-zinc-950/90 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-emerald-400 font-black text-lg tracking-tight">Stubs</Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-100">Dashboard</Link>
            <Link href={`/profile/${user.username}`} className="text-sm text-zinc-400 hover:text-zinc-100">Profile</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-zinc-100">{user.displayName}&apos;s Rankings</h1>
            <p className="text-sm text-zinc-400 mt-1">
              @{user.username} · {rankings.length} ranking{rankings.length !== 1 ? "s" : ""}
            </p>
          </div>
          {isOwner && (
            <button
              onClick={() => { setEditingRanking(null); setShowModal(true); }}
              className="border border-zinc-700 hover:border-emerald-500 text-zinc-300 hover:text-emerald-400 font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
            >
              + Create a Ranking
            </button>
          )}
        </div>

        {rankings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 mb-4">No rankings yet.</p>
            {isOwner && (
              <button
                onClick={() => { setEditingRanking(null); setShowModal(true); }}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors"
              >
                Create your first ranking →
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {rankings.map((r) => (
              <RankingCard
                key={r.id}
                ranking={r}
                teams={teams}
                venues={venues}
                games={games}
                onEdit={isOwner ? handleEdit : undefined}
                onDelete={isOwner ? handleDelete : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateRankingModal
          teams={teams}
          venues={venues}
          games={games}
          editing={editingRanking ?? undefined}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
