export function AlertBadge({ count, label }: { count: number; label: string }) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
      <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">{label}</p>
      <p className="text-2xl font-bold text-red-600">{count}</p>
    </div>
  )
  
}
