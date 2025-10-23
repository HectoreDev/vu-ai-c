// src/mcp/tools/searchCommunities.ts
import { z } from "zod";
import { sessionStore } from "../store/zustandStore";
import { createErrorResponse, ValidationResult } from "../schemas/store.schema";
import { queryDocument } from "../search/search";

type Args = z.infer<typeof undefined>;

export const searchGeoCommunities = async (): Promise<
    ValidationResult<Args>
> => {
    const { latitude, longitude, } = sessionStore.getState();


    try {
        // Obtener la consulta construida desde el estado del store
        const queryArgs = sessionStore.getState().toQuery();

        console.log('Query args from toQuery:', queryArgs);

        // Ejecutar la búsqueda con queryDocument
        const result = await queryDocument(queryArgs);

        console.log('Result from communities geo query:', result);

        return {
            success: true,
            code: 200,
            data: result,
            history: [],
            error: null,
            message: `Communities found near location (${latitude}, ${longitude})`,
            suggest: null,
        };
    } catch (error) {
        return createErrorResponse(
            error instanceof Error
                ? error
                : new Error('Unknown error searching communities')
        );
    }
};
