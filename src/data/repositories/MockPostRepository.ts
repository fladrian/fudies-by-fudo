import type { Post, PostRepository } from '@core';
import { v4 as uuidv4 } from 'uuid';

const MOCK_POSTS: Post[] = [
  {
    id: '101',
    title: 'First Post',
    content: 'This is the content of the first post.',
    authorId: '1',
    published: true,
    createdAt: new Date(),
  },
  {
    id: '102',
    title: 'Another Post',
    content: 'Here is some more content.',
    authorId: '2',
    published: true,
    createdAt: new Date(),
  },
];

export class MockPostRepository implements PostRepository {
  async getPosts(): Promise<Post[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_POSTS]), 500);
    });
  }

  async getPostsStepByAuthor(authorId: string): Promise<Post[]> {
    return new Promise((resolve) => {
      const posts = MOCK_POSTS.filter((p) => p.authorId === authorId);
      setTimeout(() => resolve(posts), 500);
    });
  }

  async createPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
    return new Promise((resolve) => {
        const newPost: Post = {
            ...post,
            id: uuidv4(),
            createdAt: new Date(),
        };
        MOCK_POSTS.push(newPost);
        setTimeout(() => resolve(newPost), 500);
    });
  }
}
