interface Props {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, sub, accent = false }: Props) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
      <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-3xl font-bold ${accent ? "text-emerald-400" : "text-zinc-100"}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
    </div>
  );
}
