import { z } from 'zod'

export const post = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  name: z.string(),
  avatar: z.string(),
  createdAt: z.string().transform(str => new Date(str)),
})

export type Post = z.infer<typeof post>
