import { Skeleton } from '@presentation/components'
import { tw } from '@presentation/utils'

interface CommentSkeletonProps {
  level?: number
}

export const CommentSkeleton = ({ level = 0 }: CommentSkeletonProps) => {
  return (
    <div
      className={tw(
        'bg-surface-muted rounded-lg p-4',
        level > 0 && 'ml-8 mt-4 border-l-2 border-surface-muted pl-4'
      )}
    >
      <div className="flex items-start space-x-3">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton variant="text" width="25%" height={14} />
            <div className="flex space-x-2">
              <Skeleton variant="rectangular" width={24} height={20} className="rounded-md" />
              <Skeleton variant="rectangular" width={24} height={20} className="rounded-md" />
            </div>
          </div>
          <Skeleton variant="text" width="20%" height={12} />
          <Skeleton variant="text" width="100%" height={14} />
          <Skeleton variant="text" width="85%" height={14} />
          <Skeleton variant="text" width="70%" height={14} />
        </div>
      </div>
    </div>
  )
}
