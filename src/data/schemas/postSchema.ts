import { z } from 'zod'
import { post } from '@core/entities'

export const postFormSchema = post.omit({ id: true }).extend({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  name: z.string().min(1, 'Name is required'),
  avatar: z.string().url('Must be a valid URL').or(z.literal('')),
  createdAt: z.string().datetime().optional(),
})

export type PostFormData = z.infer<typeof postFormSchema>
