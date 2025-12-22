import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Pencil, X, Trash2 } from 'lucide-react';
import { usePost, useDeletePost, useComments, useIsOwner, OWNERSHIP_TYPES } from '@presentation/hooks';
import { CommentTree, CreateComment, PostForm, IconButton, EmptyState, PostSkeleton, CommentSkeletonList, Modal } from '@presentation/components';
import { formatPostDate } from '@presentation/utils';

export const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading: isLoadingPost } = usePost(postId!);
  const { data: comments, isLoading: isLoadingComments } = useComments(postId!);
  const deletePost = useDeletePost();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isPostOwner = useIsOwner(OWNERSHIP_TYPES.POST, postId!);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deletePost.mutate(postId!);
    setIsDeleteModalOpen(false);
    navigate('/');
  };

  if (isLoadingPost) {
    return <PostSkeleton />;
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-gray-dark mb-2">Post not found</h2>
          <Link to="/" className="text-primary hover:text-primary-hover">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <Link to="/" className="text-primary hover:text-primary-hover font-medium text-sm sm:text-base">
          ← Back to home
        </Link>
      </div>

      <div>
        <article className="bg-surface rounded-lg shadow-card p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={post.avatar || 'https://via.placeholder.com/48'}
                alt={post.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-dark">{post.name}</p>
                <p className="text-sm text-gray">
                  {formatPostDate(post.createdAt)}
                </p>
              </div>
            </div>
            {isPostOwner && (
              <div className="flex space-x-2">
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  icon={isEditing ? <X size={16} /> : <Pencil size={16} />}
                  aria-label={isEditing ? 'Cancel edit' : 'Edit post'}
                />
                <IconButton
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteClick}
                  isLoading={deletePost.isPending}
                  disabled={deletePost.isPending}
                  icon={<Trash2 size={16} />}
                  aria-label="Delete post"
                />
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-4">
              <PostForm
                post={post}
                onSuccess={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-display font-bold text-gray-dark mb-4">{post.title}</h1>
              <div className="prose max-w-none">
                <p className="text-gray-dark whitespace-pre-wrap leading-relaxed">{post.content}</p>
              </div>
            </>
          )}
        </article>

        <section className="bg-surface rounded-lg shadow-card p-6">
          <h2 className="text-2xl font-display font-bold text-gray-dark mb-6">
            Comments {comments && comments.length > 0 && `(${comments.length})`}
          </h2>

          <div className="mb-6">
            <CreateComment postId={postId!} showToggleButton={true} />
          </div>

          {isLoadingComments ? (
            <CommentSkeletonList count={3} />
          ) : comments && comments.length > 0 ? (
            <CommentTree comments={comments} postId={postId!} />
          ) : (
            <EmptyState content="No comments yet. Be the first to comment!" className="py-8" />
          )}
        </section>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletePost.isPending}
      />
    </>
  );
};

