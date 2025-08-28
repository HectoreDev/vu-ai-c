import { z } from "zod";

export const amenitiesFromPrices = z.object({
    name: z.string().min(4, { message: "El nombre es requerido" }),
    location: z.string().min(4, { message: "La ubicación es requerida" }),
    sessionId: z.string().min(4, { message: "El token de sesión es requerido" }),
    priceMin: z.number().min(0, { message: "El precio mínimo es requerido" }),
    priceMax: z.number().min(0, { message: "El precio máximo es requerido" }),
});
