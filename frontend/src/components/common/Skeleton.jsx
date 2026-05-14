import { cn } from '../../utils/cn'

export const Skeleton = ({ className, variant = 'text' }) => {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-48 w-full rounded-xl',
    chart: 'h-64 w-full rounded-xl',
    badge: 'h-6 w-20 rounded-full',
    button: 'h-10 w-24 rounded-lg',
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-800 rounded',
        variants[variant],
        className
      )}
      aria-hidden="true"
    />
  )
}

export const CardSkeleton = () => (
  <div className="bg-card rounded-xl border border-gray-800 p-6 space-y-4">
    <Skeleton variant="title" />
    <Skeleton variant="text" />
    <Skeleton variant="text" className="w-1/2" />
    <div className="flex gap-2 pt-2">
      <Skeleton variant="badge" />
      <Skeleton variant="badge" />
    </div>
  </div>
)

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 items-center">
        <Skeleton variant="text" className="w-1/4" />
        <Skeleton variant="text" className="w-1/4" />
        <Skeleton variant="text" className="w-1/6" />
        <Skeleton variant="text" className="w-1/6" />
      </div>
    ))}
  </div>
)

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-xl border border-gray-800 p-6">
        <Skeleton variant="title" className="mb-4" />
        <Skeleton variant="chart" />
      </div>
      <div className="bg-card rounded-xl border border-gray-800 p-6">
        <Skeleton variant="title" className="mb-4" />
        <TableSkeleton rows={4} />
      </div>
    </div>
  </div>
)
