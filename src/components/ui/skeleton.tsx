import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-4 text-left"><Skeleton className="h-4 w-24" /></th>
              <th className="p-4 text-left"><Skeleton className="h-4 w-16" /></th>
              <th className="p-4 text-left"><Skeleton className="h-4 w-16" /></th>
              <th className="p-4 text-left"><Skeleton className="h-4 w-20" /></th>
              <th className="p-4 text-left"><Skeleton className="h-4 w-24" /></th>
              <th className="p-4 text-right"><Skeleton className="h-4 w-12 ml-auto" /></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                <td className="p-4"><Skeleton className="h-4 w-48" /></td>
                <td className="p-4"><Skeleton className="h-6 w-20" /></td>
                <td className="p-4"><Skeleton className="h-6 w-16" /></td>
                <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                <td className="p-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <Skeleton className="h-2.5 w-1/2" />
                  </div>
                </td>
                <td className="p-4 text-right">
                  <Skeleton className="h-8 w-8 ml-auto rounded-md" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {['Planning', 'In Progress', 'Review', 'Done'].map((status) => (
        <div key={status} className="w-72 flex-shrink-0">
          <div className="mb-4 flex items-center">
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-6 ml-auto rounded-full" />
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <CardSkeleton key={i} />
            ))}
            <div className="flex items-center p-2 text-sm text-muted-foreground">
              <Skeleton className="h-4 w-4 mr-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
