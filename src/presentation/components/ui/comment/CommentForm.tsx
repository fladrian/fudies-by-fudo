import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateComment, useUpdateComment } from '@presentation/hooks'
import { Button, Input, UserDisplay } from '@presentation/components'
import { commentFormSchema, type CommentFormData } from '@data/schemas'
import { useUserStore } from '@application'
import type { Comment } from '@core'
import { getCurrentDateISO } from '@presentation/utils'

interface CommentFormProps {
  postId: string
  parentId?: string | null
  comment?: Comment
  onSuccess?: () => void
  onCancel?: () => void
}

export const CommentForm = ({
  postId,
  parentId,
  comment,
  onSuccess,
  onCancel,
}: CommentFormProps) => {
  const createComment = useCreateComment()
  const updateComment = useUpdateComment()
  const isEditing = !!comment
  const hasStoredUser = useUserStore(state => state.hasUser())
  const setName = useUserStore(store => store.setName)
  const setAvatar = useUserStore(store => store.setAvatar)
  const userName = useUserStore(store => store.name)
  const avatar = useUserStore(store => store.avatar)
  const clearUser = useUserStore(store => store.clearUser)
  const isPending = createComment.isPending ?? updateComment.isPending

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: comment
      ? {
          name: comment.name,
          avatar: comment.avatar ?? '',
          content: comment.content,
          parentId: comment.parentId ?? null,
        }
      : {
          name: userName ?? '',
          avatar: avatar ?? '',
          content: '',
          parentId: parentId ?? null,
        },
  })

  const onSubmit = (data: CommentFormData) => {
      if (isEditing && comment) {
        updateComment.mutate({
          postId,
          commentId: comment.id,
          comment: {
            content: data.content,
            name: data.name,
            avatar: data.avatar ?? '',
            parentId: data.parentId ?? null,
          },
        })
        onSuccess?.()
      } else {
        if (data.name && data.avatar) {
          setName(data.name)
          setAvatar(data.avatar)
        }

        createComment.mutate({
          postId,
          comment: {
            content: data.content,
            name: data.name,
            avatar: data.avatar ?? '',
            parentId: data.parentId ?? null,
            createdAt: getCurrentDateISO(),
          },
        }, {
          onSuccess: () => {
            reset({ content: '', parentId: data.parentId ?? null })
            onSuccess?.()
          },
        })
      }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-surface rounded-lg p-4 border border-surface-muted"
    >
      <div className="space-y-3">
        {!isEditing && (
          <>
            {hasStoredUser ? (
              <UserDisplay
                size="sm"
                onClear={() => {
                  clearUser()
                  setValue('name', '')
                  setValue('avatar', '')
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Name"
                  id={`name-${postId}`}
                  {...register('name')}
                  placeholder="Your name"
                  error={errors.name?.message}
                />

                <Input
                  label="Avatar (URL)"
                  type="url"
                  id={`avatar-${postId}`}
                  {...register('avatar')}
                  placeholder="https://ejemplo.com/avatar.jpg"
                  error={errors.avatar?.message}
                />
              </div>
            )}
          </>
        )}

        <Input
          label={isEditing ? 'Edit comment' : parentId ? 'Reply' : 'Comment'}
          as="textarea"
          rows={3}
          id={`content-${postId}`}
          {...register('content')}
          placeholder="Write your comment here..."
          error={errors.content?.message}
        />
      </div>

      <div className="flex justify-end space-x-2 mt-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isPending}
          disabled={isPending}
        >
          {isEditing ? 'Update' : 'Comment'}
        </Button>
      </div>
    </form>
  )
}
