import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiCommentRepository } from '@data'
import { useOwnershipStore } from '@application'
import type { Post } from '@core'
import type { 
  CreateCommentParams, 
  DeleteCommentParams, 
  UpdateCommentParams 
} from '@data/types'
import type { AxiosError } from 'axios'

const commentRepository = new ApiCommentRepository()

export const useComments = (postId: Post['id']) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentRepository.getComments(postId),
    enabled: !!postId,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export const useCreateComment = () => {
  const queryClient = useQueryClient()
  const addOwnedComment = useOwnershipStore(state => state.addOwnedComment)

  return useMutation({
    mutationFn: ({ postId, comment }: CreateCommentParams) =>
      commentRepository.createComment({ postId, comment }),
    onSuccess: (createdComment, { postId }) => {
      addOwnedComment(createdComment.id)
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      toast.success('Comment created successfully')
    },
    onError: (error: AxiosError) => {
      toast.error(`Error caused by: ${error.response?.data}`)
    },
  })
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, commentId, comment }: UpdateCommentParams) =>
      commentRepository.updateComment({ postId, commentId, comment }),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      toast.success('Comment updated successfully')
    },
    onError: () => {
      toast.error('Failed to update comment')
    },
  })
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()
  const removeOwnedComment = useOwnershipStore(state => state.removeOwnedComment)
  return useMutation({
    mutationFn: ({ postId, commentId }: DeleteCommentParams) =>
      commentRepository.deleteComment({ postId, commentId }),
    onSuccess: (_, { postId, commentId }) => {
      removeOwnedComment(commentId)
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}
