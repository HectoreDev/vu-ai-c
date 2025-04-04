import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {algoliasearch} from "algoliasearch";
import {z} from "zod";

const USER_AGENT = "weather-app/1.0";

// Create server instance
const server = new McpServer({
    name: "vu-mcp-server",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {}
    }
});

interface IFUserData {
    firstTime: boolean;
    name: string;
    location: {
        state?: string,
        city: string
    };
    motivation: string[]
    budget: number;
    numberRooms: number;
    sizeArea: number;
}

interface IFContent {
    type: string;
    text: string;
    data?: IFUserData;
}

const client = algoliasearch('5WEGK1QY4E', '8df8e55bc82b699d19038a0fa007f3d7');

// Objeto para almacenar las conversaciones de los usuarios
// En un entorno real, esto debería ser una base de datos persistente
const userSessions = {};

async function makeLLMAlgoliaRequest(data : IFUserData) {
    try { // Implementa la lógica real de búsqueda con Algolia
        const results = await client.search({
            requests: [
                {
                    indexName: 'test-algolia',
                    query: data.location?.city || '',
                    numericFilters: [
                        `specs.minBed:<=${
                            data.numberRooms
                        }`,
                            `specs.maxBed>=${
                            data.numberRooms
                        }`,
                            `specs.sqft>=${
                            data.sizeArea * 0.8
                        }`,
                        `specs.sqft<=${
                            data.sizeArea * 1.2
                        }`
                    ],
                    hitsPerPage: 1
                },
            ]
        });

        if (results ?. results ?. [0] && 'hits' in results.results[0] && results.results[0].hits ?. [0]) {
            return results.results[0].hits[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error in Algolia request:", error);
        return null;
    }
}

// Tool para iniciar el flujo de conversación
server.tool("start-recommendation-flow", "Start a step-by-step conversation flow for house recommendations", {
    userId: z.string().describe("Unique identifier for the user")
}, async ({userId}) => {
    if (!userId) {
        return {
            content: [
                {
                    type: "text",
                    text: "Por favor proporciona un ID de usuario para iniciar el flujo de conversación."
                }
            ]
        };
    }

    // Inicializar o reiniciar la sesión del usuario
    (userSessions as Record < string, any >)[userId] = {
        step: 1,
        data: {}
    };

    return {
        content: [
            {
                type: "text",
                text: "¡Bienvenido a nuestro servicio de recomendación de viviendas! Vamos a hacerte algunas preguntas para encontrar la mejor opción para ti."
            }, {
                type: "text",
                text: "¿Es la primera vez que utilizas nuestra herramienta? (responde con 'sí' o 'no')"
            }
        ]
    };
});

// Tool para continuar con el flujo de conversación
server.tool("continue-flow", "Continue the conversation flow for house recommendations", {
    userId: z.string().describe("Unique identifier for the user"),
    response: z.string().describe("User's response to the current step")
}, async ({userId, response} : {
    userId: string;
    response: string
}) : Promise < {
    content: Array < {
        type: "text";
        text: string;
        data?: IFUserData;
    } >;
} > => {
    if (!userId || !(userId in userSessions)) {
        return {
            content: [
                {
                    type: "text",
                    text: "No se encontró una sesión activa. Por favor inicia el flujo con la herramienta 'start-recommendation-flow'."
                }
            ]
        };
    }

    const session = (userSessions as Record < string, any >)[userId];
    const currentStep = session.step;
    const userData = session.data as IFUserData;

    // Procesar la respuesta según el paso actual
    switch (currentStep) {
        case 1: // Respuesta a: ¿Es la primera vez?
            userData.firstTime = response.toLowerCase() === 'sí' || response.toLowerCase() === 'si' || response.toLowerCase() === 'yes' || response.toLowerCase() === 'true';
            session.step = 2;
            session.data = {
                ...userData,
                location: {
                    city: ''  
                }  
            };
            return {
                content: [
                    {
                        type: "text",
                        text: "Gracias. ¿Cuál es tu nombre?",
                        data: userData
                    }
                ]
            };

        case 2: // Respuesta a: ¿Cuál es tu nombre?
            userData.name = response.trim();
            session.step = 3;
            session.data = userData;
            return {
                content: [
                    {
                        type: "text",
                        text: `Gracias ${
                            userData.name
                        }. ¿En qué ciudad estás buscando una propiedad?`,
                        data: userData
                    }
                ]
            };

        case 3: // Respuesta a: ¿En qué ciudad? 
            userData.location.city = response.trim(); 
             
            session.step = 4;
            session.data = userData;
            return {
                content: [
                    {
                        type: "text",
                        text: `¿Cuál es tu presupuesto para la compra? (por favor indica una cantidad en dólares entre $200,000 y $1,000,000)`,
                        data: userData
                    }
                ]
            };

        case 4:
            // Respuesta a: ¿Cuál es tu presupuesto?
            // Extraer solo los números de la respuesta
            const budgetStr = response.replace(/[^0-9]/g, '');
            const budget = parseInt(budgetStr, 10);
            

            if (isNaN(budget) || budget < 200000 || budget > 1000000) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Por favor ingresa un presupuesto válido entre $200,000 y $1,000,000.",
                            data: userData
                        }
                    ]
                };
            }

            userData.budget = budget;
            session.step = 5;
            session.data = userData;
            return {
                content: [
                    {
                        type: "text",
                        text: `¿Cuántas habitaciones estás buscando? (indica un número entre 1 y 5)`,
                        data: userData
                    }
                ]
            };

        case 5: // Respuesta a: ¿Cuántas habitaciones?
            const rooms = parseInt(response.trim(), 10);
          
            if (isNaN(rooms) || rooms < 1 || rooms > 5) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Por favor ingresa un número válido de habitaciones entre 1 y 5.",
                            data: userData
                        }
                    ]
                };
            }

            userData.numberRooms = rooms;
            session.data = userData;
            session.step = 6;
            return {
                content: [
                    {
                        type: "text",
                        text: `¿Cuántos pies cuadrados de espacio necesitas? (indica un número entre 1000 y 2000)`,
                        data: userData
                    }
                ]
            };

        case 6: // Respuesta a: ¿Cuántos pies cuadrados?
            const sqft = parseInt(response.trim(), 10);

            if (isNaN(sqft) || sqft < 1000 || sqft > 2000) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Por favor ingresa un tamaño válido entre 1000 y 2000 pies cuadrados.",
                            data: userData
                        }
                    ]
                };
            }

            userData.sizeArea = sqft;
            session.data = userData;
            session.step = 7;

            // Ahora tenemos todos los datos, buscamos recomendaciones
            const result = await processCompleteData(userData);

            // Reiniciamos el paso para futuras interacciones o mantenemos en 7 para preguntas de seguimiento
            session.step = 8;

            return {
                content: result.content.map(item => ({type: "text" as const, text: item.text}))
                };

            case 8: // Usuario ya completó el flujo, preguntar si quiere otra recomendación
                if (response.toLowerCase().includes('sí') || response.toLowerCase().includes('si') || response.toLowerCase().includes('yes') || response.toLowerCase().includes('otra') || response.toLowerCase().includes('nueva')) { // Reiniciamos solo los criterios de búsqueda pero mantenemos los datos del usuario
                    session.step = 3; // Volvemos a preguntar por la ubicación
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Entendido ${
                                    userData.name
                                }. ¿En qué ciudad estás buscando una propiedad ahora?`
                            }
                        ]
                    };
                } else {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Gracias por utilizar nuestro servicio, ${
                                    userData.name
                                }. Si necesitas más recomendaciones en el futuro, no dudes en iniciar una nueva conversación.`
                            }
                        ]
                    };
                }

            default:
                return {
                    content: [
                        {
                            type: "text",
                            text: "Ha ocurrido un error en el flujo de conversación. Por favor inicia de nuevo con 'start-recommendation-flow'."
                        }
                    ]
                };
        }
    });

    // Función para procesar los datos completos y dar recomendaciones
    async function processCompleteData(userData : IFUserData) {
        const alertsData = await makeLLMAlgoliaRequest(userData);

        if (! alertsData) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Gracias por proporcionar toda la información, ${
                            userData.name
                        }.`
                    }, {
                        type: "text",
                        text: `No encontramos propiedades que coincidan exactamente con tus criterios en ${
                            userData.location.city
                        }.`
                    }, {
                        type: "text",
                        text: "¿Te gustaría buscar en otra ubicación o modificar tus criterios? (responde 'sí' para iniciar una nueva búsqueda)"
                    }
                ]
            };
        }

        // Mensaje personalizado según si es primera vez o no
        const welcomeMsg = userData.firstTime ? `Gracias por proporcionar toda la información, ${
            userData.name
        }. Hemos encontrado una propiedad que podría ser perfecta para ti.` : `Basado en tus criterios, ${
            userData.name
        }, hemos encontrado esta propiedad que podría interesarte.`;

        return {
            content: [
                {
                    type: "text",
                    text: welcomeMsg
                },
                {
                    type: "text",
                    text: `Comunidad: ${
                        (alertsData as any).community ?. name || 'Unknown'
                    } en ${
                        (alertsData as any).division ?. name || 'Unknown'
                    }`
                },
                {
                    type: "text",
                    text: `Características: ${
                        (alertsData as any).specs.bed
                    } habitaciones, ${
                        (alertsData as any).specs.level || '1'
                    } pisos y ${
                        (alertsData as any).specs.garage || 'sin'
                    } garaje.`
                },
                {
                    type: "text",
                    text: `Tamaño: ${
                        (alertsData as any).specs.sqft
                    } pies cuadrados, dentro de tu presupuesto de $${
                        userData.budget.toLocaleString()
                    }.`
                }, {
                    type: "text",
                    text: "¿Te gustaría ver otra recomendación? (responde 'sí' o 'no')"
                }
            ]
        };
    }

    // Tool para obtener el estado actual de la sesión (útil para debugging)
    server.tool("get-session-status", "Get the current status of a user's conversation session", {
        userId: z.string().describe("Unique identifier for the user")
    }, async ({userId}) => {
        if (!userId || !(userId in userSessions)) {
            return {
                content: [
                    {
                        type: "text",
                        text: "No se encontró una sesión activa para este usuario."
                    }
                ]
            };
        }

        const session = (userSessions as Record < string, any >)[userId];

        return {
            content: [
                {
                    type: "text",
                    text: `Estado actual de la sesión para el usuario ${userId}:`
                }, {
                    type: "text",
                    text: `Paso actual: ${
                        session.step
                    }`
                }, {
                    type: "text",
                    text: `Datos recopilados: ${
                        JSON.stringify(session.data, null, 2)
                    }`
                }
            ]
        };
    });

    // Tool para reiniciar el flujo de conversación
    server.tool("reset-flow", "Reset the conversation flow for a user", {
        userId: z.string().describe("Unique identifier for the user")
    }, async ({userId}) => {
        if (!userId) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Por favor proporciona un ID de usuario válido."
                    }
                ]
            };
        }

        // Si existe la sesión, la eliminamos
        if (userId in userSessions) {
            delete(userSessions as Record < string, any >)[userId];
        }

        return {
            content: [
                {
                    type: "text",
                    text: "La sesión ha sido reiniciada correctamente. Puedes iniciar un nuevo flujo con 'start-recommendation-flow'."
                }
            ]
        };
    });

    async function main() {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("Real Estate MCP Server running on stdio");
    }

    main().catch((error) => {
        console.error("Fatal error in main():", error);
        process.exit(1);
    });
