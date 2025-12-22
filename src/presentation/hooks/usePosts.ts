import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiPostRepository, type PostFormData } from '@data';
import { useOwnershipStore } from '@application';
import type { Post } from '@core';
import type { UpdatePostParams } from '@data/types';

const postRepository = new ApiPostRepository();

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => postRepository.getPosts(),
  });
};

export const usePost = (postId: Post['id']) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => postRepository.getPost(postId),
    enabled: !!postId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const addOwnedPost = useOwnershipStore(state => state.addOwnedPost);
  return useMutation({
    mutationFn: (post: PostFormData) => postRepository.createPost(post),
    onSuccess: (createdPost) => {
      addOwnedPost(createdPost.id);
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
    mutationFn: ({ postId, post }: UpdatePostParams) => postRepository.updatePost({ postId, post }),
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
  const removeOwnedPost = useOwnershipStore(state => state.removeOwnedPost);
  return useMutation({
    mutationFn: (postId: Post['id']) => postRepository.deletePost(postId),
    onSuccess: (_, postId) => {
      removeOwnedPost(postId);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
