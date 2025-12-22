import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MockPostRepository } from '@data';
import type { Post } from '@core';

const postRepository = new MockPostRepository();

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => postRepository.getPosts(),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: Omit<Post, 'id' | 'createdAt'>) => postRepository.createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
