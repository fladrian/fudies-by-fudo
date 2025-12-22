import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MockUserRepository } from '@data';
import type { User } from '@core';

// In a real app, this instance might be injected or retrieved from a context/container
const userRepository = new MockUserRepository();

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userRepository.getUsers(),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: Omit<User, 'id' | 'createdAt'>) => userRepository.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
