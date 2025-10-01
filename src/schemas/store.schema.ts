import { z } from 'zod';
import { ResponseError, ResponseSuccess } from '../mcp-llm/types/responseType';


export const sessionIdSchema = z.object({
    sessionId: z.string()
        .trim()
        .min(1, { message: 'SessionId no puede estar vacío' })
        .max(100, { message: 'SessionId no puede exceder 100 caracteres' })
        .regex(/^[a-zA-Z0-9_-]+$/, {
            message: 'SessionId solo puede contener letras, números, guiones y guiones bajos'
        })
});


export const nameSchema = z.object({
    name: z.string()
        .trim()
        .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
        .max(50, { message: 'El nombre no puede exceder 50 caracteres' })
        .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, {
            message: 'El nombre solo puede contener letras y espacios'
        })
});

export const locationsSchema = z.object({
    locations: z.array(z.string().trim().min(1))
        .min(1, { message: 'Debe proporcionar al menos una ubicación' })
        .max(5, { message: 'No puede exceder 5 ubicaciones' })
});

export const locationSchema = z.object({
    location: z.string()
        .trim()
        .min(1, { message: 'La ubicación debe tener al menos 1 caracter' })
        .max(50, { message: 'La ubicación no puede exceder 50 caracteres' })
});

export const priceRangeSchema = z.object({
    priceMin: z.number()
        .positive({ message: 'El precio mínimo debe ser positivo' })
        .max(30000000, { message: 'El precio mínimo no puede exceder $3,000,000' }),
    priceMax: z.number()
        .positive({ message: 'El precio máximo debe ser positivo' })
        .max(35000000, { message: 'El precio máximo no puede exceder $3,500,000' })
}).refine(data => data.priceMax > data.priceMin, {
    message: 'El precio máximo debe ser mayor al precio mínimo',
    path: ['priceMax']
});


export const amenitiesSchema = z.object({
    amenities: z.string()
        .trim()
        .min(1, { message: 'Las amenidades no pueden estar vacías' })
        .max(500, { message: 'Las amenidades no pueden exceder 500 caracteres' })
});


export type ValidationResult<T> = ResponseSuccess | ResponseError;

const createErrorResponse = (error: Error): ResponseError => {
    if (error instanceof z.ZodError) {
        return {
            success: false,
            data: null,
            error: error.issues.map(issue => issue.message).join(', '),
            message: 'Error de validación',
            history: [],
            code: 400
        };
    }
    return {
        success: false,
        data: null,
        error: error.message,
        message: 'Error de validación',
        history: [],
        code: 400
    };
};

const createSuccessResponse = (data: any): ResponseSuccess => {
    return {
        success: true,
        data,
        error: null,
        message: null,
        history: [],
        code: 200
    };
};

export const validateSessionId = (sessionId: string): ValidationResult<{ sessionId: string }> => {
    try {
        const data = sessionIdSchema.parse({ sessionId });
        return createSuccessResponse(data);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
}

export const validateName = (name: string): ValidationResult<{ name: string }> => {
    try {
        const data = nameSchema.parse({ name });
        return createSuccessResponse(data);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
}


export const validateLocations = (locations: string[]): ValidationResult<{ locations: string[] }> => {
    try {
        const data = locationsSchema.parse({ locations });
        return createSuccessResponse(data);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
}

export const validateLocation = (location: string): ValidationResult<{ location: string }> => {
    try {
        const data = locationSchema.parse({ location });
        console.log("validateLocation data", data);
        return createSuccessResponse(data);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
}

export const validatePriceRange = (priceMin: number, priceMax: number): ValidationResult<{ priceMin: number; priceMax: number }> => {
    try {
        const data = priceRangeSchema.parse({ priceMin, priceMax });
        return createSuccessResponse(data);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
};

export const validateAmenities = (amenities: string): ValidationResult<{ amenities: string }> => {
    try {
        const data = amenitiesSchema.parse({ amenities });
        return createSuccessResponse(data);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
};
