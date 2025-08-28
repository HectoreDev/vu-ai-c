import { z } from 'zod';

export const communityInfoSchema = z.object({
    name: z.string().min(4, { message: 'Name must be at least 4 characters long' }),
    location: z.string().min(4, { message: 'Location must be at least 4 characters long' }),
    communityUID: z.string().min(4, { message: 'Community must be at least 4 characters long' }).optional(),
    communityName: z.string().min(4, { message: 'Community must be at least 4 characters long' }).optional(),
    sessionId: z.string().min(4, { message: 'sessionId is required' })
});
