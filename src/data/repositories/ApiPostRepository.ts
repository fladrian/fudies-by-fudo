import type { Post, PostRepository } from '@core'
import { post as postEntity } from '@core/entities'
import type { UpdatePostParams } from '@data/types'
import { api } from '@shared/config/axios'
import type { PostFormData } from '@data/schemas/postSchema'

export class ApiPostRepository implements PostRepository {
  async getPosts(): Promise<Post[]> {
    const params = {
      sortBy: 'id',
      order: 'desc',
    }
    const response = await api.get('/post', { params })
    return response.data.map((item: Post) => postEntity.parse(item))
  }

  async getPost(postId: Post['id']): Promise<Post> {
    const response = await api.get(`/post/${postId}`)
    return postEntity.parse(response.data)
  }

  async createPost(post: PostFormData): Promise<Post> {
    const response = await api.post('/post', post)
    return postEntity.parse(response.data)
  }

  async updatePost({ postId, post }: UpdatePostParams): Promise<Post> {
    const response = await api.put(`/post/${postId}`, post)
    return postEntity.parse(response.data)
  }

  async deletePost(postId: Post['id']): Promise<void> {
    await api.delete(`/post/${postId}`)
  }
}
