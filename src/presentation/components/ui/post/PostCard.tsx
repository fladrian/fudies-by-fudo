import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Pencil, X, Trash2, ArrowRight } from 'lucide-react'
import { useDeletePost, useIsOwner } from '@presentation/hooks'
import { PostForm, IconButton, Modal, UserAvatar } from '@presentation/components'
import { formatPostDate } from '@presentation/utils'
import type { Post } from '@core'

interface PostCardProps {
  post: Post
  onPostUpdated?: () => void
}

export const PostCard = ({ post, onPostUpdated }: PostCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deletePost = useDeletePost()
  const isOwner = useIsOwner('post', post.id)

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    await deletePost.mutateAsync(post.id)
    setIsDeleteModalOpen(false)
  }

  const handleEditSuccess = () => {
    setIsEditing(false)
    onPostUpdated?.()
  }

  return (
    <article className="bg-surface rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <UserAvatar
          name={post.name}
          avatar={post.avatar}
          date={post.createdAt}
          size="md"
          showDate={true}
          dateFormatter={formatPostDate}
        />
        {isOwner && (
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
        <PostForm post={post} onSuccess={handleEditSuccess} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <h2 className="text-xl font-display font-bold text-gray-dark mb-2">{post.title}</h2>
          <p className="text-gray-dark mb-4 whitespace-pre-wrap">{post.content}</p>

          <div className="flex justify-end">
            <Link
              to={`/post/${post.id}`}
              className="text-primary hover:bg-primary-light font-medium transition-colors flex items-center gap-2 px-4 py-2 rounded-md"
            >
              Read more <ArrowRight size={16} />
            </Link>
          </div>
        </>
      )}

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
    </article>
  )
}
