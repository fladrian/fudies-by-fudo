import type { User, UserRepository } from '@core';
import { v4 as uuidv4 } from 'uuid'; // We might need to install uuid or use a simple generator

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    createdAt: new Date(),
  },
];

export class MockUserRepository implements UserRepository {
  async getUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_USERS]), 500);
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return new Promise((resolve) => {
      const user = MOCK_USERS.find((u) => u.id === id) || null;
      setTimeout(() => resolve(user), 500);
    });
  }

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
      return new Promise((resolve) => {
          const newUser: User = {
              ...user,
              id: uuidv4(),
              createdAt: new Date(),
          };
          MOCK_USERS.push(newUser);
          setTimeout(() => resolve(newUser), 500);
      });
  }
}
