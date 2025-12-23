import { z } from 'zod'

export const comment = z.object({
  id: z.string(),
  content: z.string(),
  name: z.string(),
  avatar: z.string(),
  parentId: z.string().nullable(),
  createdAt: z.string().transform((str: string) => new Date(str)),
})

export type Comment = z.infer<typeof comment>
