import { useState } from 'react'
import { Trash2, MessageSquare, Pencil, X } from 'lucide-react'
import { useDeleteComment, useIsOwner } from '@presentation/hooks'
import { CommentForm, CreateComment, IconButton, Modal } from '@presentation/components'
import { formatCommentDate, tw } from '@presentation/utils'
import type { Comment } from '@core'
import { OWNERSHIP_TYPES } from '@presentation/hooks'

interface CommentItemProps {
  comment: Comment
  postId: string
  level: number
}

export const CommentItem = ({ comment, postId, level }: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deleteComment = useDeleteComment()
  const isOwner = useIsOwner(OWNERSHIP_TYPES.COMMENT, comment.id)

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    deleteComment.mutate({ postId, commentId: comment.id })
    setIsDeleteModalOpen(false)
  }

  const handleEditSuccess = () => {
    setIsEditing(false)
  }

  return (
    <div
      className={tw(
        'bg-surface-muted rounded-lg p-4',
        level > 0 && 'ml-8 mt-4 border-l-2 border-surface-muted pl-4'
      )}
    >
      <div className="flex items-start space-x-3">
        <img
          src={comment.avatar || 'https://via.placeholder.com/32'}
          alt={comment.name}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-dark">{comment.name}</p>
              <p className="text-xs text-gray">{formatCommentDate(comment.createdAt)}</p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <IconButton
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
                icon={<MessageSquare size={16} />}
                aria-label={isReplying ? 'Cancel reply' : 'Reply'}
              />
              {isOwner && (
                <>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    icon={isEditing ? <X size={16} /> : <Pencil size={16} />}
                    aria-label={isEditing ? 'Cancel edit' : 'Edit comment'}
                  />
                  <IconButton
                    variant="danger"
                    size="sm"
                    onClick={handleDeleteClick}
                    isLoading={deleteComment.isPending}
                    disabled={deleteComment.isPending}
                    icon={<Trash2 size={16} />}
                    aria-label="Delete comment"
                  />
                </>
              )}
            </div>
          </div>
          {isEditing ? (
            <div className="mt-3">
              <CommentForm
                postId={postId}
                comment={comment}
                onSuccess={handleEditSuccess}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <>
              <p className="text-gray-dark text-sm whitespace-pre-wrap mb-3">{comment.content}</p>
              {isReplying && (
                <div className="mt-3">
                  <CreateComment
                    postId={postId}
                    parentId={comment.id}
                    onSuccess={() => setIsReplying(false)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteComment.isPending}
      />
    </div>
  )
}
