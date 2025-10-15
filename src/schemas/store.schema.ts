import { z } from "zod";
import { ResponseError, ResponseSuccess } from "../mcp-llm/types/responseType";
import { SessionStore, sessionStore } from "../store/zustandStore";

export const sessionIdSchema = z.object({
  sessionId: z
    .string()
    .trim()
    .min(1, { message: "SessionId no puede estar vacío" })
    .max(100, { message: "SessionId no puede exceder 100 caracteres" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        "SessionId solo puede contener letras, números, guiones y guiones bajos",
    }),
});

export const nameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede exceder 50 caracteres" })
    .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, {
      message: "El nombre solo puede contener letras y espacios",
    }),
});

export const locationsSchema = z.object({
  locations: z
    .array(z.string().trim().min(1))
    .min(1, { message: "Debe proporcionar al menos una ubicación" })
    .max(5, { message: "No puede exceder 5 ubicaciones" }),
});

// z.union([z.array(z.string()), z.string()]) este puede unir estrings si el arg no lo crea

export const locationSchema = z.object({
  location: z
    .string()
    .trim()
    .min(1, { message: "La ubicación debe tener al menos 1 caracter" })
    .max(50, { message: "La ubicación no puede exceder 50 caracteres" }),
});

export const priceRangeSchema = z.object({
  priceMin: z
    .number()
    .positive({ message: "El precio mínimo debe ser positivo" })
    .min(300000, { message: "El precio mínimo no puede ser menor a $300,000" }),
  priceMax: z
    .number()
    .positive({ message: "El precio máximo debe ser positivo" })
    .max(3500000, { message: "El precio máximo no puede exceder $3,500,000" }),
});

export const amenitiesSchema = z.object({
  amenities: z
    .string()
    .trim()
    .min(1, { message: "Las amenidades no pueden estar vacías" })
    .max(500, { message: "Las amenidades no pueden exceder 500 caracteres" }),
});

export const customizingSchema = z.object({
  customizing: z.boolean().refine((data) => typeof data === "boolean", {
    message: "El customizing debe ser booleano",
  }),
});

export const floorplanSpecsSchema = z.object({
  floorplanSpecs: z
    .string()
    .trim()
    .min(1, {
      message: "Las especificaciones del plano no pueden estar vacías",
    })
    .max(500, {
      message:
        "Las especificaciones del plano no pueden exceder 500 caracteres",
    }),
});

export const interestRateSchema = z.object({
  interestRateType: z
    .string()
    .trim()
    .min(1, { message: "La tasa de interés no puede estar vacía" })
    .max(500, {
      message: "La tasa de interés no puede exceder 500 caracteres",
    }),
});

export const interestFindHomeSchema = z.object({
  interestFindHome: z
    .string()
    .trim()
    .min(1, { message: "El interés no puede ser un arreglo vacío" })
    .max(500, { message: "El interés no puede exceder de 500 elementos" }),
});

export const interestingHomeSchema = z.object({
  interestedHome: z
    .array(z.string().trim())
    .min(1, { message: "El interés no puede ser un arreglo vacío" })
    .max(5, { message: "El interés no puede exceder de 5 elementos" }),
});

export const moveInReadySchema = z.object({
  moveInReady: z.boolean().refine((data) => typeof data === "boolean", {
    message: "El moveInReady debe ser booleano",
  }),
});

export const rentingSchema = z.object({
  renting: z.boolean().refine((data) => typeof data === "boolean", {
    message: "El renting debe ser booleano",
  }),
});

export const searchCommunitiesSchema = z.object({
  searchCommunities: z
    .string()
    .trim()
    .min(1, { message: "El searchCommunities no puede estar vacío" })
    .max(500, {
      message: "El searchCommunities no puede exceder 500 caracteres",
    }),
});

export const floorplanBedSchema = z
  .object({
    bed_min: z
      .number()
      .int({ message: "El número mínimo de habitaciones debe ser un entero" })
      .min(1, {
        message: "El número mínimo de habitaciones debe ser al menos 1",
      })
      .max(6, {
        message: "El número mínimo de habitaciones no puede exceder 4",
      }),
    bed_max: z
      .number()
      .int({ message: "El número máximo de habitaciones debe ser un entero" })
      .min(1, {
        message: "El número máximo de habitaciones debe ser al menos 1",
      })
      .max(6, {
        message: "El número máximo de habitaciones no puede exceder ",
      }),
  })
  .refine((data) => data.bed_max >= data.bed_min, {
    message:
      "El número máximo de habitaciones debe ser mayor o igual al número mínimo",
    path: ["bed_max"],
  });

export const floorplanBathSchema = z
  .object({
    bath_min: z
      .number()
      .positive({ message: "El número mínimo de baños debe ser positivo" })
      .min(1, { message: "El número mínimo de baños debe ser mayor a 0" })
      .max(5, { message: "El número mínimo de baños no puede exceder 5" })
      .refine((val) => Number.isInteger(val * 2), {
        message:
          "El número mínimo de baños debe ser un número entero o un medio baño (ej: 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)",
      }),
    bath_max: z
      .number()
      .positive({ message: "El número máximo de baños debe ser positivo" })
      .min(1, { message: "El número máximo de baños debe ser mayor a 0" })
      .max(5, { message: "El número máximo de baños no puede exceder 5" })
      .refine((val) => Number.isInteger(val * 2), {
        message:
          "El número máximo de baños debe ser un número entero o un medio baño (ej: 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)",
      }),
  })
  .refine((data) => data.bath_max >= data.bath_min, {
    message:
      "El número máximo de baños debe ser mayor o igual al número mínimo",
    path: ["bath_max"],
  });

export const floorplanLevelSchema = z
  .object({
    level_min: z
      .number()
      .int({ message: "El número mínimo de niveles debe ser un entero" })
      .min(1, { message: "El número mínimo de niveles debe ser al menos 1" })
      .max(3, { message: "El número mínimo de niveles no puede exceder 3" }),
    level_max: z
      .number()
      .int({ message: "El número máximo de niveles debe ser un entero" })
      .min(1, { message: "El número máximo de niveles debe ser al menos 1" })
      .max(3, { message: "El número máximo de niveles no puede exceder 3" }),
  })
  .refine((data) => data.level_max >= data.level_min, {
    message:
      "El número máximo de niveles debe ser mayor o igual al número mínimo",
    path: ["level_max"],
  });

export const floorplanSqftSchema = z
  .object({
    sqft_min: z
      .number()
      .int({ message: "El número mínimo de sqft debe ser un entero" })
      .min(1, { message: "El número mínimo de sqft debe ser al menos 1" })
      .max(5000, { message: "El número mínimo de sqft no puede exceder 5000" }),
    sqft_max: z
      .number()
      .int({ message: "El número máximo de sqft debe ser un entero" })
      .min(1, { message: "El número máximo de sqft debe ser al menos 1" })
      .max(5000, { message: "El número máximo de sqft no puede exceder 5000" }),
  })
  .refine((data) => data.sqft_max >= data.sqft_min, {
    message:
      "El número máximo de niveles debe ser mayor o igual al número mínimo",
    path: ["sqft_max"],
  });

export const floorplanGarageSchema = z
  .object({
    garage_min: z
      .number()
      .int({ message: "El número mínimo de garages debe ser un entero" })
      .min(1, { message: "El número mínimo de garages debe ser al menos 1" })
      .max(5, { message: "El número mínimo de garages no puede exceder 5" }),
    garage_max: z
      .number()
      .int({ message: "El número máximo de garages debe ser un entero" })
      .min(1, { message: "El número máximo de garages debe ser al menos 1" })
      .max(5, { message: "El número máximo de garages no puede exceder 5" }),
  })
  .refine((data) => data.garage_max >= data.garage_min, {
    message:
      "El número máximo de garajes debe ser mayor o igual al número mínimo",
    path: ["garage_max"],
  });

export type ValidationResult<T> = ResponseSuccess | ResponseError;

export const createErrorResponse = (error: Error): ResponseError => {
  const suggestResponse = sessionStore.getState().suggest();

  if (error instanceof z.ZodError) {
    return {
      success: false,
      data: null,
      error: error.issues.map((issue) => issue.message).join(", "),
      message: "Error de validación",
      history: [],
      code: 400,
      suggest: suggestResponse,
    };
  }
  return {
    success: false,
    data: null,
    error: error.message,
    message: "Error de validación",
    history: [],
    code: 400,
    suggest: suggestResponse,
  };
};

const createSuccessResponse = (
  data: Partial<SessionStore>,
  message: string
): ResponseSuccess => {

  return {
    success: true,
    suggest: null,
    data,
    error: null,
    message,
    history: [],
    code: 200,
  };
};

export const validateSessionId = (
  sessionId: string,
  message: string
): ValidationResult<{ sessionId: string }> => {
  try {
    const data = sessionIdSchema.parse({ sessionId });
    return createSuccessResponse(data, message);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validateName = (
  name: string,
  message: string
): ValidationResult<{ name: string }> => {
  try {
    const data = nameSchema.parse({ name });
    return createSuccessResponse(data, message);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validateLocations = (
  locations: string[],
  message: string
): ValidationResult<{ locations: string[] }> => {
  try {
    const data = locationsSchema.parse({ locations });
    return createSuccessResponse(data, message);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validateLocation = (
  location: string,
  message: string
): ValidationResult<{ location: string }> => {
  try {
    const data = locationSchema.parse({ location });
    // console.log("validateLocation data", data);

    return createSuccessResponse(data, message);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validatePriceRange = (
  priceMin: number,
  priceMax: number,
  message: string
): ValidationResult<{ priceMin: number; priceMax: number }> => {
  try {
    const data = priceRangeSchema.parse({ priceMin, priceMax });
    return createSuccessResponse(data, message);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validateAmenities = (
  amenities: string,
  message: string
): ValidationResult<{ amenities: string }> => {
  try {
    const data = amenitiesSchema.parse({ amenities });
    return createSuccessResponse(data, message);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validateCustomizing = (
  customizing: boolean,
  message: string
): ValidationResult<{ customizing: boolean }> => {
  try {
    const data = customizingSchema.parse({ customizing });
    return createSuccessResponse(data, message);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validateInterestRate = (
  interestRateType: string,
  message: string
): ValidationResult<{ interestRateType: string }> => {
  try {
    const data = interestRateSchema.parse({ interestRateType });
    return createSuccessResponse(data, message);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validateInterestedFindHome = (
  interestFindHome: string,
  message: string
): ValidationResult<{ interestFindHome: string }> => {
  try {
    // validar como arreglo
    const data = interestFindHomeSchema.parse({ interestFindHome });
    console.log("QQQQQQQQQQQ", data);

    return createSuccessResponse(
      {
        interestFindHome: data.interestFindHome,
      },
      message
    );
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validateInterestingHome = (
  interestedHome: string[],
  message: string
): ValidationResult<{ interestingHome: string }> => {
  try {
    // validar
    const data = interestingHomeSchema.parse({ interestedHome });
    return createSuccessResponse(
      {
        homeInterest: data.interestedHome,
      },
      message
    );
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validateMoveInReady = (
  moveInReady: boolean,
  message: string
): ValidationResult<{ moveInReady: boolean }> => {
  try {
    const data = moveInReadySchema.parse({ moveInReady });
    return createSuccessResponse(data, message);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validateRenting = (
  renting: boolean,
  message: string
): ValidationResult<{ renting: boolean }> => {
  try {
    const data = rentingSchema.parse({ renting });
    return createSuccessResponse(data, message);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validateFloorplanBed = (
  data: { bed_min: number; bed_max: number },
  message: string
): ValidationResult<{ bed_min: number; bed_max: number }> => {
  try {
    const validatedData = floorplanBedSchema.parse(data);
    return createSuccessResponse(
      {
        floorplanBed: {
          min: validatedData.bed_min,
          max: validatedData.bed_max,
        },
      },
      message
    );
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validateFloorplanBath = (
  data: { bath_min: number; bath_max: number },
  message: string
): ValidationResult<{ bath_min: number; bath_max: number }> => {
  try {
    const validatedData = floorplanBathSchema.parse(data);
    return createSuccessResponse(
      {
        floorplanBath: {
          min: validatedData.bath_min,
          max: validatedData.bath_max,
        },
      },
      message
    );
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validateFloorplanLevel = (
  data: { level_min: number; level_max: number },
  message: string
): ValidationResult<{ level_min: number; level_max: number }> => {
  try {
    const validatedData = floorplanLevelSchema.parse(data);
    return createSuccessResponse(
      {
        floorplanLevel: {
          min: validatedData.level_min,
          max: validatedData.level_max,
        },
      },
      message
    );
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validateFloorplanSqft = (
  data: { sqft_min: number; sqft_max: number },
  message: string
): ValidationResult<{ sqft_min: number; sqft_max: number }> => {
  try {
    const validatedData = floorplanSqftSchema.parse(data);

    return createSuccessResponse(
      {
        floorplanSqft: {
          min: validatedData.sqft_min,
          max: validatedData.sqft_max,
        },
      },
      message
    );
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};

export const validateFloorplanGarage = (
  data: { garage_min: number; garage_max: number },
  message: string
): ValidationResult<{ garage_min: number; garage_max: number }> => {
  try {
    const validatedData = floorplanGarageSchema.parse(data);
    return createSuccessResponse(
      {
        floorplanGarage: {
          min: validatedData.garage_min,
          max: validatedData.garage_max,
        },
      },
      message
    );
  } catch (error) {
    return createErrorResponse(error as Error);
  }
};
