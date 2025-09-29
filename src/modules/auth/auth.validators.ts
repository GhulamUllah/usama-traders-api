// src/modules/user/user.validation.ts

import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters long')
      .max(50, 'Name must not exceed 50 characters')
      .trim(),

    email: z.string().email('Invalid email address').trim().toLowerCase(),

    password: z.string().min(6, 'Password must be at least 6 characters long'),

    confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long'),

    role: z.enum(['user', 'admin']).optional().default('user'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ✅ Inferred TypeScript type (for strong typing in registerUser)

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),

  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;
