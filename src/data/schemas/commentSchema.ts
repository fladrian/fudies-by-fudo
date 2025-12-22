import { z } from 'zod';
import { comment } from '@core/entities';

export const commentFormSchema = comment.omit({ id: true }).extend({
  content: z.string().min(1, 'Content is required'),
  name: z.string().min(1, 'Name is required'),
  avatar: z.string().url('Must be a valid URL').or(z.literal('')),
  parentId: z.string().nullable(),
  createdAt: z.string().datetime().optional(),
});

export type CommentFormData = z.infer<typeof commentFormSchema>;
