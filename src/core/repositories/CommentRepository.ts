import type { Comment, Post } from '@core';
import type { CreateCommentParams, DeleteCommentParams, UpdateCommentParams } from '@data/types';

export interface CommentRepository {
  getComments(postId: Post['id']): Promise<Comment[]>;
  createComment({ postId, comment }: CreateCommentParams): Promise<Comment>;
  updateComment({ postId, commentId, comment }: UpdateCommentParams): Promise<Comment>;
  deleteComment({ postId, commentId }: DeleteCommentParams): Promise<void>;
}

