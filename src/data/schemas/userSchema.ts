import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
  createdAt: z.string().transform((str) => new Date(str)),
});

// We can also infer the type from the schema if we want to bind them tightly, 
// but Clean Architecture suggests keeping the Entity independent.
// For the Data layer, strictly speaking, this is the DTO schema.
