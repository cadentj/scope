import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

function SkeletonItem({ width = 'w-full' }: { width?: string }) {
  return (
    <div className={`h-4 bg-muted rounded animate-pulse ${width}`} />
  )
}

export function ChatHistory() {
  return (
    <aside className="w-64 h-full border-r border-border flex flex-col bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-semibold">Scope</h1>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button variant="outline" className="w-full justify-start gap-2">
          <PlusIcon className="size-4" />
          New chat
        </Button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {/* Starred Section */}
        <div className="mb-6">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Starred
          </h2>
          <div className="space-y-3">
            <SkeletonItem width="w-4/5" />
            <SkeletonItem width="w-3/4" />
            <SkeletonItem width="w-5/6" />
          </div>
        </div>

        {/* Recents Section */}
        <div>
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Recents
          </h2>
          <div className="space-y-3">
            <SkeletonItem width="w-full" />
            <SkeletonItem width="w-3/4" />
            <SkeletonItem width="w-5/6" />
            <SkeletonItem width="w-2/3" />
            <SkeletonItem width="w-4/5" />
            <SkeletonItem width="w-full" />
          </div>
        </div>
      </div>

      {/* User area at bottom */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-muted animate-pulse" />
          <SkeletonItem width="w-20" />
        </div>
      </div>
    </aside>
  )
}

