import type { Comment, CommentRepository, Post } from '@core'
import { comment as commentEntity } from '@core/entities'
import { api } from '@shared/config/axios'
import type { CreateCommentParams, DeleteCommentParams, UpdateCommentParams } from '@data/types'

export class ApiCommentRepository implements CommentRepository {
  async getComments(postId: Post['id']): Promise<Comment[]> {
    const response = await api.get(`/post/${postId}/comment`)
    return response.data.map((item: Comment) => commentEntity.parse(item))
  }

  async createComment({ postId, comment }: CreateCommentParams): Promise<Comment> {
    const response = await api.post(`/post/${postId}/comment`, comment)
    return commentEntity.parse(response.data)
  }

  async updateComment({ postId, commentId, comment }: UpdateCommentParams): Promise<Comment> {
    const response = await api.put(`/post/${postId}/comment/${commentId}`, comment)
    return commentEntity.parse(response.data)
  }

  async deleteComment({ postId, commentId }: DeleteCommentParams): Promise<void> {
    await api.delete(`/post/${postId}/comment/${commentId}`)
  }
}
