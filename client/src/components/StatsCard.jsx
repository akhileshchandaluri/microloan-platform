export default function StatsCard({ title, value, children }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-400">{title}</div>
          <div className="text-2xl font-bold mt-2">{value}</div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
