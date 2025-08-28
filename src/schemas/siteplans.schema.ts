import { z } from 'zod';


export const siteplansSchema = z.object({
    communityUID: z.string().min(4, { message: 'Community UID must be at least 4 characters long' }),
    sessionId: z.string().min(4, { message: 'sessionId is required' })
});
