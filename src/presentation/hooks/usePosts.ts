import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiPostRepository, type PostFormData } from '@data';
import { PostUseCases } from '@application';
import type { Post } from '@core';
import type { UpdatePostParams } from '@data/types';

const postRepository = new ApiPostRepository();
const postUseCases = new PostUseCases(postRepository);

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => postUseCases.getPosts(),
  });
};

export const usePost = (postId: Post['id']) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => postUseCases.getPost(postId),
    enabled: !!postId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: PostFormData) => postUseCases.createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully');
    },
    onError: () => {
      toast.error('Failed to create post');
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, post }: UpdatePostParams) => postUseCases.updatePost({ postId, post }),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      toast.success('Post updated successfully');
    },
    onError: () => {
      toast.error('Failed to update post');
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: Post['id']) => postUseCases.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
