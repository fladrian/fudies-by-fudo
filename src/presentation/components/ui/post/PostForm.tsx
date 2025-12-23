import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreatePost, useUpdatePost } from '@presentation/hooks'
import { Button, Input, UserDisplay } from '@presentation/components'
import { postFormSchema, type PostFormData } from '@data/schemas'
import { useUserStore } from '@application'
import type { Post } from '@core'
import { getCurrentDateISO } from '@presentation/utils'

interface PostFormProps {
  post?: Post
  onSuccess?: () => void
  onCancel?: () => void
}

export const PostForm = ({ post, onSuccess, onCancel }: PostFormProps) => {
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()
  const isEditing = !!post
  const avatar = useUserStore(store => store.avatar)
  const clearUser = useUserStore(store => store.clearUser)
  const userName = useUserStore(store => store.name)
  const setName = useUserStore(store => store.setName)
  const setAvatar = useUserStore(store => store.setAvatar)
  const hasStoredUser = useUserStore(state => state.hasUser())

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: post
      ? {
          title: post.title,
          content: post.content,
          name: post.name,
          avatar: post.avatar ?? '',
        }
      : {
          name: userName ?? '',
          avatar: avatar ?? '',
        },
  })

  const handleCancel = () => {
    reset()
    onCancel?.()
  }

  const handleSuccess = () => {
    reset()
    onSuccess?.()
  }

  const onSubmit = (data: PostFormData) => {
      if (isEditing && post) {
        updatePost.mutate({
          postId: post.id,
          post: {
            title: data.title,
            content: data.content,
            name: data.name,
            avatar: data.avatar ?? '',
          },
        })
      } else {
        if (data.name && data.avatar) {
          setName(data.name)
          setAvatar(data.avatar)
        }

        createPost.mutate({
          title: data.title,
          content: data.content,
          name: data.name,
          avatar: data.avatar ?? '',
          createdAt: getCurrentDateISO(),
        }, {
          onSuccess: () => {
            handleSuccess()
          },
        })
      }
  }

  return (
    <div className="bg-surface rounded-lg shadow-card p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-lg font-display font-semibold mb-4 text-gray-dark">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h3>

        <div className="space-y-4">
          {!isEditing && hasStoredUser ? (
            <UserDisplay
              onClear={() => {
                clearUser()
                setValue('name', '')
                setValue('avatar', '')
              }}
            />
          ) : (
            <>
              <Input
                label="Name"
                {...register('name')}
                placeholder="Your name"
                error={errors.name?.message}
              />

              <Input
                label="Avatar (URL)"
                type="url"
                {...register('avatar')}
                placeholder="https://ejemplo.com/avatar.jpg"
                error={errors.avatar?.message}
              />
            </>
          )}

          <Input
            label="Title"
            {...register('title')}
            placeholder="Post title"
            error={errors.title?.message}
          />

          <Input
            label="Content"
            as="textarea"
            rows={6}
            {...register('content')}
            placeholder="Write your content here..."
            error={errors.content?.message}
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            isLoading={createPost.isPending || updatePost.isPending}
            disabled={createPost.isPending || updatePost.isPending}
          >
            {isEditing ? 'Update' : 'Publish'}
          </Button>
        </div>
      </form>
    </div>
  )
}
