import { z } from 'zod';
import { ResponseError, ResponseSuccess } from '../mcp-llm/types/responseType';
import { SessionStore } from '../store/zustandStore';


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

// z.union([z.array(z.string()), z.string()]) este puede unir estrings si el arg no lo crea

export const locationSchema = z.object({
    location: z.string()
        .trim()
        .min(1, { message: 'La ubicación debe tener al menos 1 caracter' })
        .max(50, { message: 'La ubicación no puede exceder 50 caracteres' })
});

export const priceRangeSchema = z.object({
    priceMin: z.number()
        .positive({ message: 'El precio mínimo debe ser positivo' })
        .max(3000000, { message: 'El precio mínimo no puede exceder $300,000' }),
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


export const customizingSchema = z.object({
    customizing: z.boolean()
        .refine(data => typeof data === 'boolean', {
            message: 'El customizing debe ser booleano'
        })
});

export const floorplanSpecsSchema = z.object({
    floorplanSpecs: z.string()
        .trim()
        .min(1, { message: 'Las especificaciones del plano no pueden estar vacías' })
        .max(500, { message: 'Las especificaciones del plano no pueden exceder 500 caracteres' })
});

export const interestRateSchema = z.object({
    interestRate: z.string()
        .trim()
        .min(1, { message: 'La tasa de interés no puede estar vacía' })
        .max(500, { message: 'La tasa de interés no puede exceder 500 caracteres' })
});

export const interestedFindHomeSchema = z.object({
    interestedFindHome: z.array(z.string().trim())
        .min(1, { message: 'El interés no puede ser un arreglo vacío' })
        .max(5, { message: 'El interés no puede exceder de 5 elementos' })
});

export const interestingHomeSchema = z.object({
    interestingHome: z.array(z.string().trim())
        .min(1, { message: 'El interés no puede ser un arreglo vacío' })
        .max(5, { message: 'El interés no puede exceder de 5 elementos' })
});

export const moveInReadySchema = z.object({
    moveInReady: z.boolean()
        .refine(data => typeof data === 'boolean', {
            message: 'El moveInReady debe ser booleano'
        })
});

export const rentingSchema = z.object({
    renting: z.string()
        .trim()
        .min(1, { message: 'El renting no puede estar vacío' })
        .max(500, { message: 'El renting no puede exceder 500 caracteres' })
});

export const searchCommunitiesSchema = z.object({
    searchCommunities: z.string()
        .trim()
        .min(1, { message: 'El searchCommunities no puede estar vacío' })
        .max(500, { message: 'El searchCommunities no puede exceder 500 caracteres' })
});

export const floorplanBedSchema = z.object({
    floorplanBed: z.number()
        .min(1, { message: 'El floorplanBed no puede estar vacío' })
        .max(5, { message: 'El floorplanBed no puede exceder 5' })
});

export const floorplanBathSchema = z.object({
    floorplanBath: z.number()
        .positive({ message: 'El floorplanBath debe ser positivo' })
        .min(1, { message: 'El floorplanBath debe ser mayor a 0' })
        .max(4, { message: 'El floorplanBath no puede exceder 4' })
        .refine(
            (val) => Number.isInteger(val * 2),
            { message: 'El floorplanBath debe ser un número entero o un medio baño (ej: 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)' }
        )
});

export const floorplanLevelSchema = z.object({
    floorplanLevel: z.number()
        .min(1, { message: 'El floorplanLevel debe ser mayor a 0' })
        .max(3, { message: 'El floorplanLevel no puede exceder 3' })
});

export const floorplanSqftSchema = z.object({
    floorplanSqft: z.string()
        .trim()
        .min(1, { message: 'El floorplanSqft no puede estar vacío' })
        .max(500, { message: 'El floorplanSqft no puede exceder 500 caracteres' })
});

export const floorplanGarageSchema = z.object({
    floorplanGarage: z.string()
        .trim()
        .min(1, { message: 'El floorplanGarage no puede estar vacío' })
        .max(500, { message: 'El floorplanGarage no puede exceder 500 caracteres' })
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

const createSuccessResponse = (data: Partial<SessionStore>, message: string): ResponseSuccess => {


    return {
        success: true,
        data,
        error: null,
        message,
        history: [],
        code: 200
    };
};

export const validateSessionId = (sessionId: string, message: string): ValidationResult<{ sessionId: string }> => {
    try {
        const data = sessionIdSchema.parse({ sessionId });
        return createSuccessResponse(data, message);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
}

export const validateName = (name: string, message: string): ValidationResult<{ name: string }> => {
    try {
        const data = nameSchema.parse({ name });
        return createSuccessResponse(data, message);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
}


export const validateLocations = (locations: string[], message: string): ValidationResult<{ locations: string[] }> => {
    try {
        const data = locationsSchema.parse({ locations });
        return createSuccessResponse(data, message);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
}

export const validateLocation = (location: string, message: string): ValidationResult<{ location: string }> => {
    try {
        const data = locationSchema.parse({ location });
        console.log("validateLocation data", data);

        return createSuccessResponse(data, message);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
}

export const validatePriceRange = (priceMin: number, priceMax: number, message: string): ValidationResult<{ priceMin: number; priceMax: number }> => {
    try {
        const data = priceRangeSchema.parse({ priceMin, priceMax });
        return createSuccessResponse(data, message);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
};

export const validateAmenities = (amenities: string, message: string): ValidationResult<{ amenities: string }> => {
    try {
        const data = amenitiesSchema.parse({ amenities });
        return createSuccessResponse(data, message);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
};

export const validateCustomizing = (customizing: boolean, message: string): ValidationResult<{ customizing: boolean }> => {
    try {
        const data = customizingSchema.parse({ customizing });
        return createSuccessResponse(data, message);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
};


export const validateInterestRate = (interestRate: string, message: string): ValidationResult<{ interestRate: string }> => {
    try {
        const data = interestRateSchema.parse({ interestRate });
        return createSuccessResponse(data, message);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
};

export const validateInterestedFindHome = (interestedFindHome: string[], message: string): ValidationResult<{ interestedFindHome: string }> => {
    try {
        // validar como arreglo
        const data = interestedFindHomeSchema.parse({ interestedFindHome });
        return createSuccessResponse({
            interest: data.interestedFindHome
        }, message);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
};

export const validateInterestingHome = (interestingHome: string[], message: string): ValidationResult<{ interestingHome: string }> => {
    try {
        // validar 
        const data = interestingHomeSchema.parse({ interestingHome });
        return createSuccessResponse({
            homeInterest: data.interestingHome
        }, message);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
};

export const validateMoveInReady = (moveInReady: boolean, message: string): ValidationResult<{ moveInReady: boolean }> => {
    try {
        const data = moveInReadySchema.parse({ moveInReady });
        return createSuccessResponse(data, message);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
};

export const validateRenting = (renting: string, message: string): ValidationResult<{ renting: string }> => {
    try {
        const data = rentingSchema.parse({ renting });
        return createSuccessResponse(data, message);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
};


