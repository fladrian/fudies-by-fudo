import type { Post, Comment } from '@core'
import type { CommentFormData, PostFormData } from '@data'

export interface UpdateCommentParams {
  postId: Post['id']
  commentId: Comment['id']
  comment: CommentFormData
}

export interface CreateCommentParams {
  postId: Post['id']
  comment: CommentFormData
}

export interface DeleteCommentParams {
  postId: Post['id']
  commentId: Comment['id']
}

export interface CreatePostParams {
  post: PostFormData
}

export interface UpdatePostParams {
  postId: Post['id']
  post: PostFormData
}
