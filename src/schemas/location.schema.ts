import { z } from "zod";

export const location = z.object({
    name: z.string().min(4, { message: "El nombre es requerido" }),
    location: z.string().min(4, { message: "La ubicación es requerida" }),
    sessionId: z.string().min(4, { message: "El token de sesión es requerido" }),
});