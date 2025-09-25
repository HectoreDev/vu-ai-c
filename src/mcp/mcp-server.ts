import { createServer, Tool } from "@modelcontextprotocol/sdk";
import {
  executeSessionTool,
  executeGetNameTool,
  executeGetLocationTool,
  executeGetMinMaxPricesTool,
  executeGetAmenitiesFromPricesTool,
  executeGetCommunitiesTool,
  executeGetCommunityInfoTool,
  executeCheckSessionTool,
  executeSiteplansTool,
  executeGetFloorplansTool
} from "./mcp.tools";

// Define las tools MCP exponiendo tus funciones existentes
const tools: Tool[] = [
  {
    name: "session-start",
    description: "Inicia una nueva sesión de usuario.",
    parameters: {
      type: "object",
      properties: {},
      required: []
    },
    handler: executeSessionTool
  },
  {
    name: "get-name",
    description: "Guarda el nombre del usuario en la sesión.",
    parameters: {
      type: "object",
      properties: {
        sessionId: { type: "string", description: "ID de sesión" },
        name: { type: "string", description: "Nombre del usuario" }
      },
      required: ["sessionId", "name"]
    },
    handler: executeGetNameTool
  },
  {
    name: "get-location",
    description: "Guarda la ubicación del usuario en la sesión.",
    parameters: {
      type: "object",
      properties: {
        sessionId: { type: "string", description: "ID de sesión" },
        location: { type: "string", description: "Ubicación" }
      },
      required: ["sessionId", "location"]
    },
    handler: executeGetLocationTool
  },
  {
    name: "get-min-max-prices",
    description: "Obtiene el rango de precios para una ubicación.",
    parameters: {
      type: "object",
      properties: {
        sessionId: { type: "string", description: "ID de sesión" },
        location: { type: "string", description: "Ubicación" }
      },
      required: ["sessionId", "location"]
    },
    handler: executeGetMinMaxPricesTool
  },
  {
    name: "get-amenities-from-prices",
    description: "Obtiene amenidades según el rango de precios.",
    parameters: {
      type: "object",
      properties: {
        sessionId: { type: "string", description: "ID de sesión" },
        location: { type: "string", description: "Ubicación" },
        priceMin: { type: "number", description: "Precio mínimo" },
        priceMax: { type: "number", description: "Precio máximo" }
      },
      required: ["sessionId", "location", "priceMin", "priceMax"]
    },
    handler: executeGetAmenitiesFromPricesTool
  },
  {
    name: "get-communities",
    description: "Obtiene comunidades para una ubicación.",
    parameters: {
      type: "object",
      properties: {
        sessionId: { type: "string", description: "ID de sesión" },
        location: { type: "string", description: "Ubicación" }
      },
      required: ["sessionId", "location"]
    },
    handler: executeGetCommunitiesTool
  },
  {
    name: "get-community-info",
    description: "Obtiene información detallada de una comunidad.",
    parameters: {
      type: "object",
      properties: {
        sessionId: { type: "string", description: "ID de sesión" },
        communityName: { type: "string", description: "Nombre de la comunidad" },
        communityUID: { type: "string", description: "UID de la comunidad" }
      },
      required: ["sessionId"]
    },
    handler: executeGetCommunityInfoTool
  },
  {
    name: "check-session",
    description: "Verifica si una sesión es válida.",
    parameters: {
      type: "object",
      properties: {
        sessionId: { type: "string", description: "ID de sesión" }
      },
      required: ["sessionId"]
    },
    handler: executeCheckSessionTool
  },
  {
    name: "get-siteplans",
    description: "Obtiene los siteplans de una comunidad.",
    parameters: {
      type: "object",
      properties: {
        sessionId: { type: "string", description: "ID de sesión" },
        communityUID: { type: "string", description: "UID de la comunidad" }
      },
      required: ["sessionId", "communityUID"]
    },
    handler: executeSiteplansTool
  },
  {
    name: "get-floorplans",
    description: "Obtiene los floorplans de una comunidad.",
    parameters: {
      type: "object",
      properties: {
        sessionId: { type: "string", description: "ID de sesión" },
        communityUID: { type: "string", description: "UID de la comunidad" }
      },
      required: ["sessionId", "communityUID"]
    },
    handler: executeGetFloorplansTool
  }
];

// Lanza el MCP server en el puerto 3333
createServer({ tools }).listen(3333, () => {
  console.log("MCP server corriendo en http://localhost:3333");
});
