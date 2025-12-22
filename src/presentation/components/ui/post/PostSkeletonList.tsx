import { PostSkeleton } from '@presentation/components';

interface PostSkeletonListProps {
  count?: number;
}

export const PostSkeletonList = ({ count = 3 }: PostSkeletonListProps) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
};

