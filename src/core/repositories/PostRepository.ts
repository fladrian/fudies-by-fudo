import type { Post } from '../entities/Post';

export interface PostRepository {
  getPosts(): Promise<Post[]>;
  getPostsStepByAuthor(authorId: string): Promise<Post[]>;
  createPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<Post>;
}
