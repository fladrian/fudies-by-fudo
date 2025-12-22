import type { Post } from '../entities/Post';
import type { UpdatePostParams } from '@data/types';
import type { PostFormData } from '@data/schemas/postSchema';

export interface PostRepository {
  getPosts(): Promise<Post[]>;
  getPost(postId: Post['id']): Promise<Post>;
  createPost(post: PostFormData): Promise<Post>;
  updatePost({ postId, post }: UpdatePostParams): Promise<Post>;
  deletePost(postId: Post['id']): Promise<void>;
}
