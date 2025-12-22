import { Skeleton } from '@presentation/components';

export const PostSkeleton = () => {
  return (
    <article className="bg-surface rounded-lg shadow-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="30%" height={16} />
            <Skeleton variant="text" width="40%" height={14} />
          </div>
        </div>
        <div className="flex space-x-2">
          <Skeleton variant="rectangular" width={32} height={32} className="rounded-md" />
          <Skeleton variant="rectangular" width={32} height={32} className="rounded-md" />
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="90%" height={16} />
        <Skeleton variant="text" width="80%" height={16} />
      </div>

      <div className="mt-4">
        <Skeleton variant="text" width={100} height={16} />
      </div>
    </article>
  );
};

