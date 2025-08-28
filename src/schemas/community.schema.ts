import { z } from 'zod';

export const communitySchema = z.object({
    name: z.string().min(4, { message: 'Name must be at least 4 characters long' }),
    location: z.string().min(4, { message: 'Location must be at least 4 characters long' }),
    sessionId: z.string().min(4, { message: 'sessionId is required' })
});