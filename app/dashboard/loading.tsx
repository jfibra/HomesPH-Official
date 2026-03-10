function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`} />
}

export default function DashboardLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="space-y-2">
        <Block className="h-8 w-56" />
        <Block className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Block className="h-32 w-full" />
        <Block className="h-32 w-full" />
        <Block className="h-32 w-full" />
        <Block className="h-32 w-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Block className="h-72 w-full" />
        <Block className="h-72 w-full" />
      </div>
      <Block className="h-80 w-full" />
    </div>
  )
}
