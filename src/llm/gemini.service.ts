import { model } from "./gemini.config";
import { mcpServer } from "../mcp/mcp.server";
import { invalidateSession } from "../mcp/mcp.tools";


interface SessionState {
    step: number; // 0: session-start, 1: get-name, 2: get-location, 3: get-min-max-prices, 4: get-amenities-from-prices, 5: get-communities, 6: get-community-info, 7: completed
    name?: string;
    location?: string;
    priceMin?: number;
    priceMax?: number;
    amenities?: string;
    communities?: string;
    community?: string;
    lastToolUsed?: string;
    sessionId?: string;
    mcpSessionId?: string; // Token de sesión del sistema MCP
}

export class GeminiService {
    // Storage simple para el estado de las sesiones  
    private sessionStates: Map<string, SessionState> = new Map();

    private getSessionKey(sessionId?: number): string {
        return sessionId ? `session_${sessionId}` : 'default_session';
    }

    private getSessionState(sessionId?: number): SessionState | null {
        const key = this.getSessionKey(sessionId);
        return this.sessionStates.get(key) || null;
    }

    private createNewSessionState(sessionId?: number): SessionState {
        const key = this.getSessionKey(sessionId);
        const newState: SessionState = { step: 0 };
        this.sessionStates.set(key, newState);
        return newState;
    }

    private updateSessionState(sessionId: number | undefined, updates: Partial<SessionState>): void {
        const key = this.getSessionKey(sessionId);
        const currentState = this.getSessionState(sessionId);
        if (currentState) {
            this.sessionStates.set(key, { ...currentState, ...updates });
            console.log('Estado de sesión actualizado:', this.sessionStates.get(key));
        }
    }

    async chatWithTools(message: string, sessionId?: number) {
        try {
            const sessionState = this.getSessionState(sessionId);

            // Si no hay sesión, verificar si el mensaje es para iniciar o contiene un nombre
            if (!sessionState) {
                const lowerMessage = message.toLowerCase();

                // Detectar palabras de inicio tradicionales
                const isStartMessage = lowerMessage.includes('hola') || lowerMessage.includes('iniciar') ||
                    lowerMessage.includes('hello') || lowerMessage.includes('start');

                // Detectar patrones de nombres
                const namePatterns = [
                    /soy\s+([a-záéíóúñü\s]+)/i,
                    /mi\s+nombre\s+es\s+([a-záéíóúñü\s]+)/i,
                    /me\s+llamo\s+([a-záéíóúñü\s]+)/i,
                    /soy\s+([a-zA-Z\s]+)/i,
                    /my\s+name\s+is\s+([a-zA-Z\s]+)/i,
                    /i\s+am\s+([a-zA-Z\s]+)/i
                ];

                let extractedName = null;
                for (const pattern of namePatterns) {
                    const match = message.match(pattern);
                    if (match && match[1]) {
                        extractedName = match[1].trim();
                        break;
                    }
                }

                if (isStartMessage || extractedName) {
                    // Crear nueva sesión
                    const newSessionState = this.createNewSessionState(sessionId);
                    console.log('Nueva sesión creada:', newSessionState);

                    if (extractedName) {
                        // Si hay nombre, ir directo a crear sesión MCP y procesar el nombre
                        console.log('Nombre detectado:', extractedName);

                        // Primero crear la sesión MCP
                        const sessionResult = await mcpServer.callTool("session-start", { data: {} });
                        console.log('Resultado de session-start:', sessionResult);

                        if (sessionResult.success && sessionResult.data?.sessionId) {
                            // Actualizar el estado con la sesión MCP
                            this.updateSessionState(sessionId, {
                                step: 1,
                                mcpSessionId: sessionResult.data.sessionId,
                                lastToolUsed: 'session-start'
                            });

                            // Ahora procesar el nombre
                            const nameResult = await mcpServer.callTool("get-name", {
                                data: {
                                    sessionId: sessionResult.data.sessionId,
                                    name: extractedName
                                }
                            });
                            console.log('Resultado de get-name:', nameResult);

                            if (nameResult.success) {
                                // Actualizar estado para el siguiente paso
                                this.updateSessionState(sessionId, {
                                    name: extractedName,
                                    step: 2,
                                    lastToolUsed: 'get-name'
                                });

                                const baseMessage = `¡Hola ${extractedName}! Sesión iniciada exitosamente. Ahora necesito saber en qué ubicación estás buscando tu hogar.`;

                                return this.generateContextualResponse(baseMessage, 'get-name', nameResult, newSessionState)
                                    .then(enhancedResponse => ({
                                        text: enhancedResponse,
                                        toolsUsed: ['session-start', 'get-name'],
                                        sessionId: sessionResult.data.sessionId,
                                        sessionState: {
                                            step: 2,
                                            completed: false,
                                            nextAction: 'get-location'
                                        }
                                    }));
                            }
                        }

                        // Si algo falla, continuar con flujo normal
                        return {
                            text: `¡Hola ${extractedName}! Hubo un problema iniciando la sesión. Por favor, intenta de nuevo.`,
                            toolsUsed: []
                        };
                    } else {
                        // Flujo normal de inicio de sesión con palabras clave
                        const prompt = this.buildPromptForCurrentStep(message, newSessionState);
                        console.log('Prompt:', prompt);

                        const result = await model.generateContent(prompt);
                        const response = result.response.text();
                        console.log('Respuesta original de Gemini:', response);

                        const toolCall = this.extractAndParseJSON(response);
                        if (toolCall && toolCall.action === "tool") {
                            const toolResult = await mcpServer.callTool(toolCall.tool, toolCall.args);
                            const handledResult = await this.handleToolResult(toolCall.tool, toolResult, sessionId, newSessionState);
                            return handledResult;
                        }
                    }
                } else {
                    // No hay sesión y no es mensaje de inicio ni contiene nombre
                    return {
                        text: "Hola, para comenzar necesito que primero inicies una sesión. Puedes decir 'hola', 'iniciar' o directamente decirme tu nombre como 'mi nombre es Juan'.",
                        toolsUsed: []
                    };
                }
            }

            // En este punto sessionState debe existir
            if (!sessionState) {
                throw new Error('SessionState should exist at this point');
            }

            console.log('Estado actual de la sesión:', sessionState);

            // Construir prompt dinámico basado en el estado actual
            const prompt = this.buildPromptForCurrentStep(message, sessionState);
            console.log('Prompt:', prompt);

            const result = await model.generateContent(prompt);
            const response = result.response.text();
            console.log('Respuesta original de Gemini:', response);

            // Intentar extraer y parsear JSON
            const toolCall = this.extractAndParseJSON(response);

            if (toolCall && toolCall.action === "tool") {
                console.log('JSON parseado exitosamente:', toolCall);

                const toolResult = await mcpServer.callTool(toolCall.tool, toolCall.args);
                console.log('Resultado de la herramienta:', toolResult);

                // Manejar el resultado y actualizar el estado
                const handledResult = await this.handleToolResult(toolCall.tool, toolResult, sessionId, sessionState);
                console.log('Resultado manejado:', handledResult);
                return handledResult;
            }

            return {
                text: response,
                toolsUsed: []
            };

        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.error('Error en GeminiService:', errMsg);
            throw new Error(`Error en Gemini: ${errMsg}`);
        }
    }

    private buildPromptForCurrentStep(message: string, sessionState: SessionState): string {
        const { step, name, location, priceMin, priceMax, amenities, communities, community, mcpSessionId } = sessionState;

        // Validar que tenemos mcpSessionId para steps que lo requieren
        if (step > 0 && !mcpSessionId) {
            console.warn('⚠️ mcpSessionId no disponible para step:', step);
        }

        let contextInfo = '';
        let nextAction = '';
        let availableData = '';

        // Construir información de contexto basada en datos ya recolectados
        if (name) availableData += `\n- Nombre recolectado: ${name}`;
        if (location) availableData += `\n- Ubicación recolectada: ${location}`;
        if (priceMin) availableData += `\n- Precio mínimo recolectado: ${priceMin}`;
        if (priceMax) availableData += `\n- Precio máximo recolectado: ${priceMax}`;
        if (amenities) availableData += `\n- Amenidades recolectadas: ${amenities}`;
        if (communities) availableData += `\n- Comunidades recolectadas: ${communities}`;
        if (community) availableData += `\n- Comunidad recolectada: ${community}`;

        switch (step) {
            case 0:
                contextInfo = 'PASO ACTUAL: 0 - Inicializar el flujo de la aplicación, el detonador son las palabras "hola", "iniciar", "hello", "start"';
                nextAction = `Debes usar EXCLUSIVAMENTE la herramienta "session-start" con el siguiente formato JSON exacto:
                {
                    "action": "tool",
                    "tool": "session-start",
                    "args": { "data": {} }
                }`;
                break;
            case 1:
                contextInfo = 'PASO ACTUAL: 1 - Solicitar el nombre al usuario, puedes darle sugerencias como "invitado", "amigo"';
                nextAction = `Debes usar EXCLUSIVAMENTE la herramienta "get-name" con el siguiente formato JSON exacto:
                {
                    "action": "tool",
                    "tool": "get-name",
                    "args": { 
                        "data": { 
                            "sessionId": "${mcpSessionId || 'ERROR_NO_SESSION'}",
                            "name": "nombre_que_proporcione_el_usuario" 
                        } 
                    }
                }`;
                break;
            case 2:
                contextInfo = 'PASO ACTUAL: 2 - Solicitar la ubicación donde buscar casas';
                nextAction = `Debes usar EXCLUSIVAMENTE la herramienta "get-location" con el siguiente formato JSON exacto:
                {
                    "action": "tool",
                    "tool": "get-location", 
                    "args": { 
                        "data": { 
                            "sessionId": "${mcpSessionId || 'ERROR_NO_SESSION'}",
                            "location": "ubicación_que_proporcione_el_usuario" 
                        } 
                    }
                }
                
                IMPORTANTE: 
                - Pregunta al usuario: "¿En qué ciudad o zona deseas buscar casas?"
                - Usa la respuesta exacta del usuario como valor para "location"
                - NO inventes ubicaciones, usa exactamente lo que diga el usuario`;
                break;
            case 3:
                contextInfo = 'PASO ACTUAL: 3 - Buscar el rango de precios en la ubicación proporcionada por el usuario';
                nextAction = `Debes usar EXCLUSIVAMENTE la herramienta "get-min-max-prices" con el siguiente formato JSON exacto:
                {
                    "action": "tool",
                    "tool": "get-min-max-prices",
                    "args": { 
                        "data": { 
                            "sessionId": "${mcpSessionId || 'ERROR_NO_SESSION'}",
                            "location": "ubicación_que_proporcione_el_usuario" 
                        } 
                    }
                }`;
                break;
            case 4:
                contextInfo = 'PASO ACTUAL: 4 - Buscar las amenidades en el rango de precios proporcionado por el usuario';
                nextAction = `Debes usar EXCLUSIVAMENTE la herramienta "get-amenities-from-prices" con el siguiente formato JSON exacto:
                {
                    "action": "tool",
                    "tool": "get-amenities-from-prices",
                    "args": { 
                        "data": { 
                            "sessionId": "${mcpSessionId || 'ERROR_NO_SESSION'}",
                            "location": "ubicación_que_proporcione_el_usuario",
                            "priceMin": "precio_mínimo_que_proporcione_el_usuario",
                            "priceMax": "precio_máximo_que_proporcione_el_usuario"
                        } 
                    }
                }`;
                break;

            case 5:
                contextInfo = 'PASO ACTUAL: 5 - Buscar comunidades en la ubicacion proporcionada por el usuario';
                nextAction = `Debes usar EXCLUSIVAMENTE la herramienta "get-communities" con el siguiente formato JSON exacto:
                {
                    "action": "tool",
                    "tool": "get-communities",
                    "args": { 
                        "data": { 
                            "sessionId": "${mcpSessionId || 'ERROR_NO_SESSION'}" 
                        } 
                    }
                }`;
                break;
            case 6:
                contextInfo = 'PASO ACTUAL: 6 - Buscar comunidad en caso de que se haya proporcionado una comunidad';
                nextAction = `Debes usar EXCLUSIVAMENTE la herramienta "get-community-info" con el siguiente formato JSON exacto:
                {
                    "action": "tool",
                    "tool": "get-community-info",
                    "args": { 
                        "data": { 
                            "sessionId": "${mcpSessionId || 'ERROR_NO_SESSION'}",
                            "communityName": "nombre_de_comunidad_proporcionado",
                            "communityUID": "uid_de_comunidad_proporcionado"
                        } 
                    }
                }`;
                break;
            case 7:
                contextInfo = 'PASO ACTUAL: 7- FIn del Flujo';
                nextAction = 'Muestra el mensaje final: "¡Gracias! Hemos terminado la recolección de datos."';
                break;
        }

        return `Eres un asistente que recolecta información en pasos SECUENCIALES.

            ${contextInfo}
            ${availableData ? `\nDATOS YA RECOLECTADOS:${availableData}` : ''}

            ESTADO ACTUAL:
            ${nextAction}

            REGLAS ABSOLUTAS:
            - Solo ejecutar UNA herramienta por interacción
            - Seguir el orden estricto: init -> get-name -> get-location -> get-min-max-prices -> get-amenities-from-prices -> get-communities -> get-community-info
            - NO saltar pasos ni retroceder
            - Esperar confirmación del sistema antes de avanzar

            Usuario: ${message}

            Si necesitas usar una herramienta, responde ÚNICAMENTE con el JSON sin texto adicional:
            {
                "action": "tool",
                "tool": "nombre-de-tool",
                "args": { "data": { /* argumentos */ } }
            }

            Si no necesitas herramientas, responde normalmente.`;
    }

    private async generateContextualResponse(baseMessage: string, toolName: string, toolResult: any, sessionState: SessionState): Promise<string> {
        try {
            const contextPrompt = `
                Eres un asistente amigable y profesional para una aplicación de búsqueda de casas.
                
                CONTEXTO ACTUAL:
                - Herramienta ejecutada: ${toolName}
                - Paso actual: ${sessionState.step}
                - Datos recolectados: ${sessionState.name ? `Nombre: ${sessionState.name}` : ''} 
                ${sessionState.location ? `Ubicación: ${sessionState.location}` : ''} 
                ${sessionState.priceMin ? `Precio Mínimo: ${sessionState.priceMin}` : ''}
                ${sessionState.priceMax ? `Precio Máximo: ${sessionState.priceMax}` : ''}
                ${sessionState.amenities ? `Amenidades: ${sessionState.amenities}` : ''} 
                ${sessionState.communities ? `Comunidades: ${sessionState.communities}` : ''}
                
                MENSAJE BASE: ${baseMessage}
                
                RESULTADO DE LA HERRAMIENTA: ${JSON.stringify(toolResult)}
                
                CONTEXTO DE SESIÓN:
                - Última herramienta usada: ${sessionState.lastToolUsed}
                - Datos disponibles: ${JSON.stringify(sessionState)}
                
                INSTRUCCIONES:
                - Genera una respuesta natural, amigable y profesional
                - Mantén el mensaje base pero hazlo más conversacional
                - Si hay información adicional en el resultado de la herramienta, incorpórala naturalmente
                - Para el caso de get-communities, solo muestra 4 comunidades del listado de comunidades
                - Usa emojis apropiados (máximo 2)
                - Mantén un tono positivo y guía al usuario hacia el siguiente paso
                - La respuesta debe ser concisa (máximo 2-3 líneas)
                
                Responde únicamente con el mensaje mejorado, sin explicaciones adicionales.
            `;

            const result = await model.generateContent(contextPrompt);
            const enhancedResponse = result.response.text().trim();

            console.log('🤖 Respuesta contextual generada:', enhancedResponse);
            return enhancedResponse;

        } catch (error) {
            console.error('Error generando respuesta contextual:', error);
            // Si falla, devolver el mensaje base
            return baseMessage;
        }
    }

    private async handleToolResult(toolName: string, toolResult: any, sessionId: number | undefined, sessionState: SessionState): Promise<any> {
        console.log(`Manejando resultado de ${toolName}:`, toolResult);

        // Verificar si el resultado indica éxito
        if (toolResult.success) {
            let responseText = '';
            let nextStep = sessionState.step;

            switch (toolName) {
                case 'session-start':
                    if (toolResult.data && toolResult.data.sessionId) {
                        this.updateSessionState(sessionId, {
                            step: 1,
                            mcpSessionId: toolResult.data.sessionId,
                            lastToolUsed: toolName,
                            sessionId: toolResult.data.sessionId
                        });

                        // Usar el mensaje específico de la herramienta si está disponible
                        const baseMessage = toolResult.data.nextStep
                            ? `Sesión iniciada exitosamente ${toolResult.data.nextStep}`
                            : `Sesión iniciada exitosamente. Ahora necesito que me proporciones tu nombre.`;

                        // Generar respuesta contextual
                        return this.generateContextualResponse(baseMessage, toolName, toolResult.message, sessionState)
                            .then(enhancedResponse => ({
                                text: enhancedResponse,
                                toolsUsed: [toolName],
                                sessionId: toolResult.data.sessionId,
                                sessionState: {
                                    step: 1,
                                    completed: false,
                                    nextAction: 'get-name'
                                }
                            }));

                    } else {
                        return {
                            text: `❌ Error: session-start no devolvió un ID válido. Respuesta recibida: ${JSON.stringify(toolResult)}`,
                            toolsUsed: [toolName],
                            sessionState: {
                                step: sessionState.step,
                                completed: false,
                                nextAction: 'session-start'
                            }
                        };
                    }
                    break;
                case 'get-name':
                    if (toolResult.data && toolResult.data.name && toolResult.data.sessionId) {
                        this.updateSessionState(sessionId, {
                            name: toolResult.data.name,
                            sessionId: toolResult.data.sessionId,
                            step: 2,
                            lastToolUsed: toolName
                        });

                        const baseMessage = `Ahora necesito tu ubicación.`;

                        // Generar respuesta contextual
                        return this.generateContextualResponse(baseMessage, toolName, toolResult.message, { ...sessionState, name: toolResult.data.name })
                            .then(enhancedResponse => ({
                                text: enhancedResponse,
                                toolsUsed: [toolName],
                                sessionState: {
                                    step: 2,
                                    completed: false,
                                    nextAction: 'get-location'
                                }
                            }));

                    } else {
                        return {
                            text: `❌ Error: get-name no devolvió un nombre válido. Respuesta recibida: ${JSON.stringify(toolResult)}`,
                            toolsUsed: [toolName],
                            sessionState: {
                                step: sessionState.step,
                                completed: false,
                                nextAction: 'get-name'
                            }
                        };
                    }
                    break;
                case 'get-location':
                    if (toolResult.data && toolResult.data.location && toolResult.data.sessionId) {
                        this.updateSessionState(sessionId, {
                            location: toolResult.data.location,
                            step: 3,
                            lastToolUsed: toolName
                        });

                        console.log('🏃‍♂️ Ejecutando get-min-max-prices automáticamente después de obtener la ubicación');

                        let minMax;
                        try {
                            // Ejecutar get-min-max-prices con timeout
                            const timeoutPromise = new Promise((_, reject) => {
                                setTimeout(() => reject(new Error('Timeout: get-min-max-prices tardó más de 60 segundos')), 60000);
                            });

                            const minMaxPromise = mcpServer.callTool("get-min-max-prices", {
                                data: {
                                    sessionId: toolResult.data.sessionId,
                                    name: toolResult.data.name,
                                    location: toolResult.data.location
                                }
                            });

                            minMax = await Promise.race([minMaxPromise, timeoutPromise]);
                            console.log('🏘️ Resultado de get-min-max-prices automático:', minMax);

                        } catch (error: any) {
                            console.error('❌ Error en get-min-max-prices automático:', error.message);

                            // Si hay error, devolver respuesta indicando el problema pero manteniendo la ubicación guardada
                            const errorMessage = `Ubicación guardada correctamente en ${toolResult.data.location}, pero hubo un problema obteniendo los precios: ${error.message}. ¿Podrías intentar nuevamente o verificar la ubicación?`;

                            return this.generateContextualResponse(errorMessage, toolName, toolResult, { ...sessionState, location: toolResult.data.location })
                                .then(enhancedResponse => ({
                                    text: enhancedResponse,
                                    toolsUsed: [toolName],
                                    error: error.message,
                                    sessionState: {
                                        step: 3, // Mantener en step 3 para reintentar get-min-max-prices
                                        completed: false,
                                        nextAction: 'get-min-max-prices'
                                    }
                                }));
                        }

                        // Manejar el resultado de get-min-max-prices
                        if (minMax.success && minMax.data && minMax.data.priceMin && minMax.data.priceMax) {
                            this.updateSessionState(sessionId, {
                                priceMin: minMax.data.priceMin,
                                priceMax: minMax.data.priceMax,
                                location: toolResult.data.location,
                                step: 4,
                                lastToolUsed: 'get-location'
                            });

                            const updatedState = this.getSessionState(sessionId)!;
                            const baseMessage = `¡Excelente! Encontré el rango de precios en ${toolResult.data.location}:\n\nMínimo: $${minMax.data.priceMin?.toLocaleString()}\nMáximo: $${minMax.data.priceMax?.toLocaleString()}\n\n Ingresa o selecciona el rango de precios que se ajuste a tu búsqueda`;

                            // Generar respuesta contextual
                            return this.generateContextualResponse(baseMessage, 'get-min-max-prices', minMax.data.message, updatedState)
                                .then(enhancedResponse => ({
                                    text: enhancedResponse,
                                    toolsUsed: [toolName, 'get-min-max-prices'],
                                    priceMin: minMax.data.priceMin,
                                    priceMax: minMax.data.priceMax,
                                    location: toolResult.data.location,
                                    sessionState: {
                                        step: 4,
                                        completed: false,
                                        nextAction: 'get-amenities-from-prices'
                                    }
                                }));
                        } else {
                            // Si get-min-max-prices falla, mantener en step 3 para retry
                            const errorMessage = `Ubicación guardada en ${toolResult.data.location}, pero hubo un problema obteniendo los precios: ${minMax.error || 'Error desconocido'}. ¿Podrías intentar con otra ubicación o verificar que sea correcta?`;

                            return this.generateContextualResponse(errorMessage, toolName, toolResult, { ...sessionState, location: toolResult.data.location })
                                .then(enhancedResponse => ({
                                    text: enhancedResponse,
                                    toolsUsed: [toolName, 'get-min-max-prices'],
                                    sessionState: {
                                        step: 3,
                                        completed: false,
                                        nextAction: 'get-min-max-prices'
                                    }
                                }));
                        }

                    } else {
                        return {
                            text: `❌ Error: get-location no devolvió una ubicación válida. Respuesta recibida: ${JSON.stringify(toolResult)}`,
                            toolsUsed: [toolName],
                            sessionState: {
                                step: sessionState.step,
                                completed: false,
                                nextAction: 'get-location'
                            }
                        };
                    }
                    break;

                case 'get-min-max-prices':
                    if (toolResult.success && toolResult.data && toolResult.data.priceMin && toolResult.data.priceMax) {
                        this.updateSessionState(sessionId, {
                            location: toolResult.data.location,
                            priceMin: toolResult.data.priceMin,
                            priceMax: toolResult.data.priceMax,
                            step: 4,
                            lastToolUsed: toolName
                        });

                        const baseMessage = `¡Excelente! Encontré el rango de precios en ${toolResult.data.location}:\n\nMínimo: $${toolResult.data.priceMin?.toLocaleString()}\nMáximo: $${toolResult.data.priceMax?.toLocaleString()}\n\nSelecciona el rango de precios que se ajuste a tu búsqueda`;

                        // Generar respuesta contextual
                        return this.generateContextualResponse(baseMessage, toolName, toolResult.data.message, sessionState)
                            .then(enhancedResponse => ({
                                text: enhancedResponse,
                                toolsUsed: [toolName],
                                location: toolResult.data.location,
                                priceMin: toolResult.data.priceMin,
                                priceMax: toolResult.data.priceMax,
                                sessionState: {
                                    step: 4,
                                    completed: false,
                                    nextAction: 'get-amenities-from-prices'
                                }
                            }));
                    } else {
                        const errorDetail = toolResult.error || 'No se pudo obtener rango de precios';
                        console.error('❌ Error detallado en get-min-max-prices:', toolResult);

                        return {
                            text: `❌ Error al obtener precios: ${errorDetail}. Por favor verifica la ubicación e intenta nuevamente.`,
                            toolsUsed: [toolName],
                            error: errorDetail,
                            sessionState: {
                                step: sessionState.step,
                                completed: false,
                                nextAction: 'get-min-max-prices'
                            }
                        };
                    }
                    break;

                case 'get-amenities-from-prices':
                    if (toolResult.success && toolResult.data && toolResult.data.amenities) {
                        this.updateSessionState(sessionId, {
                            location: toolResult.data.location,
                            priceMin: toolResult.data.priceMin,
                            priceMax: toolResult.data.priceMax,
                            amenities: toolResult.data.amenities,
                            step: 4,
                            lastToolUsed: toolName
                        });

                        const updatedState = this.getSessionState(sessionId)!;

                        // Formatear las amenidades para mostrar información legible
                        let amenitiesText = '';
                        if (toolResult.data.amenities && Array.isArray(toolResult.data.amenities)) {
                            const allAmenities = toolResult.data.amenities.flat(); // Aplanar el array anidado
                            const uniqueAmenities = allAmenities.filter((amenity: any, index: number, self: any[]) =>
                                index === self.findIndex((a: any) => a.name === amenity.name)
                            );

                            amenitiesText = uniqueAmenities.map((amenity: any) =>
                                `• ${amenity.name}: ${amenity.description}`
                            ).join('\n');
                        } else {
                            amenitiesText = 'No se encontraron amenidades específicas';
                        }

                        const baseMessage = `¡Excelente! Encontré las amenidades en ${toolResult.data.location}:\n\n🎯 AMENIDADES DISPONIBLES:\n${amenitiesText}\n\n¿Te interesa información específica de alguna comunidad?`;

                        // Generar respuesta contextual
                        return this.generateContextualResponse(baseMessage, toolName, toolResult.data.message, updatedState)
                            .then(enhancedResponse => ({
                                text: enhancedResponse,
                                toolsUsed: [toolName],
                                amenities: toolResult.data.amenities,
                                location: toolResult.data.location,
                                priceMin: toolResult.data.priceMin,
                                priceMax: toolResult.data.priceMax,
                                sessionState: {
                                    step: 4,
                                    completed: false,
                                    nextAction: 'get-communities'
                                }
                            }));

                    } else {
                        const errorDetail = toolResult.error || 'No se pudieron obtener amenidades';
                        console.error('❌ Error detallado en get-amenities-from-prices:', toolResult);

                        return {
                            text: `❌ Error al obtener amenidades: ${errorDetail}. Por favor verifica el rango de precios e intenta nuevamente.`,
                            toolsUsed: [toolName],
                            error: errorDetail,
                            sessionState: {
                                step: sessionState.step,
                                completed: false,
                                nextAction: 'get-amenities-from-prices'
                            }
                        };
                    }
                    break;

                case 'get-communities':
                    if (toolResult.success && toolResult.data && toolResult.data.communities) {
                        this.updateSessionState(sessionId, {
                            communities: toolResult.data.communities,
                            step: 5,
                            lastToolUsed: toolName
                        });
                        const finalState = this.getSessionState(sessionId)!;

                        const baseMessage = `¡Excelente! Encontré varias comunidades en ${toolResult.data.location || finalState.location}:\n\n${toolResult.data.communities}\n\n¿Te interesa información específica de alguna comunidad?`;

                        // Generar respuesta contextual
                        return this.generateContextualResponse(baseMessage, toolName, toolResult.data.message, finalState)
                            .then(enhancedResponse => ({
                                text: enhancedResponse,
                                toolsUsed: [toolName],
                                communities: toolResult.data.communitiesArray,
                                sessionState: {
                                    step: 5,
                                    completed: false,
                                    nextAction: 'get-community-info'
                                }
                            }));

                    } else {
                        const errorDetail = toolResult.error || 'No se pudieron obtener comunidades';
                        console.error('❌ Error detallado en get-communities:', toolResult);

                        return {
                            text: `❌ Error al obtener comunidades: ${errorDetail}. Por favor verifica la ubicación e intenta nuevamente.`,
                            toolsUsed: [toolName],
                            error: errorDetail,
                            sessionState: {
                                step: sessionState.step,
                                completed: false,
                                nextAction: 'get-communities'
                            }
                        };
                    }
                    break;
                case 'get-community-info':
                    if (toolResult.data && toolResult.data.community) {
                        this.updateSessionState(sessionId, {
                            community: toolResult.data.community,
                            step: 6,
                            lastToolUsed: toolName
                        });
                        const finalState = this.getSessionState(sessionId)!;

                        // Obtener información de siteplans
                        const communityInfo = toolResult.data.community;
                        console.log('🏗️ Obteniendo siteplans para communityUID:', communityInfo?.uid);

                        const siteplansResult = await mcpServer.callTool("get-siteplans", {
                            data: {
                                sessionId: finalState.mcpSessionId,
                                communityUID: communityInfo?.uid
                            }
                        });

                        console.log('🏗️ Resultado de get-siteplans:', JSON.stringify(siteplansResult, null, 2));

                        // Invalidar la sesión MCP automáticamente
                        if (finalState.mcpSessionId) {
                            const sessionInvalidated = invalidateSession(finalState.mcpSessionId);
                            console.log(`🔚 Sesión MCP ${finalState.mcpSessionId} invalidada:`, sessionInvalidated);
                        }

                        // Limpiar el estado de sesión local del Gemini Service
                        this.clearSessionState(sessionId);
                        console.log(`🧹 Estado de sesión local limpiado para sessionId: ${sessionId}`);

                        // Crear resumen mejorado con información de la comunidad
                        const amenitiesList = communityInfo?.amenities?.map((a: any) => `• ${a.feature}: ${a.description}`).join('\n') || 'No disponible';

                        // Extraer información de siteplans
                        let siteplanInfo = '';
                        if (siteplansResult.success && siteplansResult.data?.siteplans?.length > 0) {
                            const firstSiteplan = siteplansResult.data.siteplans[0];
                            const siteplanName = firstSiteplan.name || 'No disponible';
                            const siteplanStatus = firstSiteplan.status || 'No disponible';

                            // Obtener 3 lots del objeto lot
                            const lotsObj = firstSiteplan.lot || {};
                            const lotsArray = Object.values(lotsObj);
                            const first3Lots = lotsArray.slice(0, 3);
                            const lotsList = first3Lots.map((lot: any) => `• ${lot.name || 'Sin nombre'}`).join('\n') || 'No disponible';

                            siteplanInfo = `
                                🏗️ INFORMACIÓN DEL SITEPLAN:
                                📋 Nombre: ${siteplanName}
                                📊 Status: ${siteplanStatus}
                                🏠 Lotes disponibles (primeros 3):
                                ${lotsList}`;
                        } else {
                            siteplanInfo = `
                                🏗️ INFORMACIÓN DEL SITEPLAN:
                                ❌ No se encontraron siteplans para esta comunidad`;
                        }

                        const baseMessage = `¡Perfecto! tenemos informacion de tu búsqueda de hogar. 
                                                        
                                📋 RESUMEN DE TU BÚSQUEDA:
                                👤 Nombre: ${finalState.name}
                                📍 Ubicación: ${finalState.location}
                                🏘️ Comunidad seleccionada: ${communityInfo?.name || 'No disponible'}
                                🆔 UID: ${communityInfo?.uid || 'No disponible'}

                                🏡 AMENIDADES DE LA COMUNIDAD:
                                ${amenitiesList}
                                ${siteplanInfo}

                                ¡Gracias por usar nuestro servicio! Si deseas realizar una nueva búsqueda, puedes decir 'hola' o directamente indicar tu nombre para comenzar de nuevo.`;

                        // Generar respuesta contextual
                        return this.generateContextualResponse(baseMessage, toolName, toolResult.data.message, finalState)
                            .then(enhancedResponse => ({
                                text: enhancedResponse + "\n\n🔄 Para iniciar una nueva búsqueda, puedes decir 'hola' o directamente tu nombre.",
                                toolsUsed: [toolName, 'get-siteplans'],
                                community: toolResult.data.community,
                                sessionState: {
                                    step: 6, // Resetear a step inicial
                                    completed: true,
                                    nextAction: 'completed',
                                    sessionEnded: true
                                }
                            }));

                    } else {
                        return {
                            text: `❌ Error: get-community-info no devolvió una comunidad. Respuesta recibida: ${JSON.stringify(toolResult)}`,
                            toolsUsed: [toolName],
                            sessionState: {
                                step: sessionState.step,
                                completed: false,
                                nextAction: 'get-community-info'
                            }
                        };
                    }
                    break;
                case 'completed':
                    return {
                        text: `¡Gracias! Hemos terminado la recolección de datos.`,
                        toolsUsed: [toolName],
                        sessionState: {
                            step: 5,
                            completed: true,
                            nextAction: 'completed'
                        }
                    };
                default:
                    return {
                        text: `❌ Herramienta desconocida: ${toolName}`,
                        toolsUsed: [toolName],
                        sessionState: {
                            step: sessionState.step,
                            completed: false,
                            nextAction: this.getNextActionName(sessionState.step)
                        }
                    };
            }
        } else {
            // Si no hay éxito, mantener el mismo paso y mostrar error
            return {
                text: `❌ Error al procesar ${toolName}: ${toolResult.error || 'Error desconocido'}. Por favor, intenta nuevamente.`,
                toolsUsed: [toolName],
                sessionState: {
                    step: sessionState.step,
                    completed: false,
                    nextAction: this.getNextActionName(sessionState.step)
                }
            };
        }
    }

    private getNextActionName(step: number): string {
        switch (step) {
            case 0: return 'session-start';
            case 1: return 'get-name';
            case 2: return 'get-location';
            case 3: return 'get-min-max-prices';
            case 4: return 'get-amenities-from-prices';
            case 5: return 'get-communities';
            case 6: return 'get-community-info';
            case 7: return 'completed';
            default: return 'completed';
        }
    }

    // Método para limpiar el estado de una sesión (opcional)
    clearSessionState(sessionId?: number): void {
        const key = this.getSessionKey(sessionId);
        this.sessionStates.delete(key);
        console.log(`Estado de sesión ${key} limpiado`);
    }

    // Método para obtener el estado actual de una sesión (opcional)
    getSessionStatePublic(sessionId?: number): SessionState | null {
        return this.getSessionState(sessionId);
    }

    private extractAndParseJSON(response: string): any {
        try {
            // Limpiar la respuesta de espacios y saltos de línea al inicio y final
            let cleanResponse = response.trim();

            // Caso 1: Intentar parsear directamente
            try {
                return JSON.parse(cleanResponse);
            } catch {
                // Continuar con otros métodos
            }

            // Caso 2: Buscar JSON dentro de bloques de código markdown
            const jsonBlockMatch = cleanResponse.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
            if (jsonBlockMatch) {
                return JSON.parse(jsonBlockMatch[1].trim());
            }

            // Caso 3: Buscar JSON que empiece con { y termine con }
            const jsonMatch = cleanResponse.match(/{[\s\S]*}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0].trim());
            }

            // Caso 4: Si la respuesta contiene líneas, buscar la que sea JSON válido
            const lines = cleanResponse.split('\n');
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('{') && trimmedLine.endsWith('}')) {
                    try {
                        return JSON.parse(trimmedLine);
                    } catch {
                        continue;
                    }
                }
            }

            console.log('No se pudo extraer JSON válido de la respuesta');
            return null;

        } catch (error) {
            console.error('Error al extraer/parsear JSON:', error);
            return null;
        }
    }
}

export const geminiService = new GeminiService(); 