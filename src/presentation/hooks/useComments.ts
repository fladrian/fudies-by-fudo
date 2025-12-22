import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiCommentRepository } from '@data';
import { CommentUseCases } from '@application';
import type { Post } from '@core';
import type { CreateCommentParams, DeleteCommentParams, UpdateCommentParams } from '@data/types';
import type { AxiosError } from 'axios';

const commentRepository = new ApiCommentRepository();
const commentUseCases = new CommentUseCases(commentRepository);

export const useComments = (postId: Post['id']) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentUseCases.getComments(postId),
    enabled: !!postId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, comment }: CreateCommentParams) =>
      commentUseCases.createComment({ postId, comment }),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment created successfully');
    },
    onError: (error: AxiosError) => {
      toast.error(`Error caused by: ${error.response?.data}`);
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, commentId, comment }: UpdateCommentParams) =>
      commentUseCases.updateComment({ postId, commentId, comment }),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment updated successfully');
    },
    onError: () => {
      toast.error('Failed to update comment');
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, commentId }: DeleteCommentParams) =>
      commentUseCases.deleteComment({ postId, commentId }),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
};

