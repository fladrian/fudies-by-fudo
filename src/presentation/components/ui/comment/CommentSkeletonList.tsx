import { CommentSkeleton } from '@presentation/components'

interface CommentSkeletonListProps {
  count?: number
}

export const CommentSkeletonList = ({ count = 3 }: CommentSkeletonListProps) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <CommentSkeleton key={index} />
      ))}
    </div>
  )
}
