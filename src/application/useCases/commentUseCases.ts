import type { Comment, CommentRepository, Post } from '@core';
import { useOwnershipStore } from '@application';
import type {
  CreateCommentParams,
  DeleteCommentParams,
  UpdateCommentParams,
} from '@data/types';

export class CommentUseCases {
  private commentRepository: CommentRepository;

  constructor(commentRepository: CommentRepository) {
    this.commentRepository = commentRepository;
  }

  async getComments(postId: Post['id']): Promise<Comment[]> {
    return this.commentRepository.getComments(postId);
  }

  async createComment({ postId, comment }: CreateCommentParams): Promise<Comment> {
    const createdComment = await this.commentRepository.createComment({ postId, comment });
    useOwnershipStore.getState().addOwnedComment(createdComment.id);
    return createdComment;
  }

  async updateComment({ postId, commentId, comment }: UpdateCommentParams): Promise<Comment> {
    return this.commentRepository.updateComment({ postId, commentId, comment });
  }

  async deleteComment({ postId, commentId }: DeleteCommentParams): Promise<void> {
    await this.commentRepository.deleteComment({ postId, commentId });
    useOwnershipStore.getState().removeOwnedComment(commentId);
  }
}

