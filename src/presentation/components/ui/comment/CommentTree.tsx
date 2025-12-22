import { CommentItem } from '@presentation/components';
import { tw } from '@presentation/utils';
import type { Comment } from '@core';

interface CommentTreeProps {
  comments: Comment[];
  postId: string;
  parentId?: string | null;
  level?: number;
}

export const CommentTree = ({ comments, postId, parentId = null, level = 0 }: CommentTreeProps) => {
  const rootComments = comments.filter((comment) => comment.parentId === parentId);

  if (rootComments.length === 0) {
    return null;
  }

  return (
    <div className={tw(level > 0 && 'ml-8 mt-4 border-l-2 border-surface-muted pl-4')}>
      {rootComments.map((comment) => {
        const childComments = comments.filter((c) => c.parentId === comment.id);
        return (
          <div key={comment.id} className="mb-4">
            <CommentItem comment={comment} postId={postId} level={level} />
            {childComments.length > 0 && (
              <CommentTree comments={comments} postId={postId} parentId={comment.id} level={level + 1} />
            )}
          </div>
        );
      })}
    </div>
  );
};

