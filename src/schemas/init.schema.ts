import { z } from "zod";

export const initSchema = z.object({
    name: z.string().optional()
});