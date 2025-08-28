import { z } from 'zod';


export const lotSchema = z.object({
    name: z.string().min(4, { message: 'Name must be at least 4 characters long' }),
    location: z.string().min(4, { message: 'Location must be at least 4 characters long' }),
    community: z.string().min(4, { message: 'Community must be at least 4 characters long' }),
    lot: z.string().optional(),
    sessionId: z.string().min(4, { message: 'sessionId is required' })
});
