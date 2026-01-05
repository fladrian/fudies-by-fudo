import { Link, useNavigate } from 'react-router-dom'
import { OWNERSHIP_TYPES, useDeletePost, useIsOwner, usePost } from '@presentation/hooks'
import { formatPostDate } from '@presentation/utils'
import { IconButton, Modal, PostForm, PostSkeleton, UserAvatar } from '@presentation/components'
import { Pencil, X, Trash2 } from 'lucide-react'
import type { Post } from '@core'
import { useState } from 'react'

interface PostDetailProps {
  postId: Post['id']
}

export const PostDetail = ({ postId }: PostDetailProps) => {
  const navigate = useNavigate()
  const { data: post, isPending } = usePost(postId!)
  const isPostOwner = useIsOwner(OWNERSHIP_TYPES.POST, postId!)
  const deletePost = useDeletePost()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    deletePost.mutate(postId!)
    setIsDeleteModalOpen(false)
    navigate('/')
  }

  if (isPending) {
    return <PostSkeleton />
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
    )
  }

  return (
    <>
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

      <section className="bg-surface rounded-lg shadow-card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <UserAvatar
            name={post.name}
            avatar={post.avatar}
            date={post.createdAt}
            size="lg"
            showDate={true}
            dateFormatter={formatPostDate}
          />
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
      </section>
    </>
  )
}
