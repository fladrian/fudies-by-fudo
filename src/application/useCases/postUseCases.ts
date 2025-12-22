import type { Post, PostRepository } from '@core';
import { useOwnershipStore } from '@application';
import type { UpdatePostParams } from '@data/types';
import type { PostFormData } from '@data/schemas';

export class PostUseCases {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async getPosts(): Promise<Post[]> {
    return this.postRepository.getPosts();
  }

  async getPost(postId: Post['id']): Promise<Post> {
    return this.postRepository.getPost(postId);
  }

  async createPost( post : PostFormData): Promise<Post> {
    const createdPost = await this.postRepository.createPost(post);
    useOwnershipStore.getState().addOwnedPost(createdPost.id);
    return createdPost;
  }

  async updatePost({ postId, post }: UpdatePostParams): Promise<Post> {
    return this.postRepository.updatePost({ postId, post });
  }

  async deletePost(postId: Post['id']): Promise<void> {
    await this.postRepository.deletePost(postId);
    useOwnershipStore.getState().removeOwnedPost(postId);
  }
}

