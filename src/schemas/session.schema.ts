import { z } from 'zod';

export const sessionSchema = z.object({
    name: z.string().min(4, { message: 'Name must be at least 4 characters long' }).optional()
});