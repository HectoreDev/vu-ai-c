import { z } from 'zod';

// Schema para crear usuario
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  age: z.number().int().min(18, 'Must be at least 18 years old').max(120, 'Age must be realistic'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

// Schema para actualizar usuario (todos los campos opcionales)
export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  age: z.number().int().min(18).max(120).optional()
});

// Schema para login
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Schema para parámetros de URL
export const userParamsSchema = z.object({
  id: z.string().uuid('Invalid user ID format')
});

// Tipos TypeScript derivados de los schemas
export type CreateUserType = z.infer<typeof createUserSchema>;
export type UpdateUserType = z.infer<typeof updateUserSchema>;
export type LoginType = z.infer<typeof loginSchema>;
export type UserParamsType = z.infer<typeof userParamsSchema>;
