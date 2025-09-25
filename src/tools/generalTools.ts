const toolsName = {
  name: "getName",
  description: "Obten el nombre del usuario si lo ha agregado y solo regresa el nombre",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Retorna el nombre que ha brindado el usuario",
      },
    },
    required: ["name"],
  },
};

const toolsLocation = {
  name: "getLocation",
  description: "Sí el usuario ha añadido una ciudad o estado, obten la información del lugar",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "Añade locación",
      },
    },
    required: ["location"],
  },
};

const toolsBudget = {
  name: "getBudget",
  description: "This tool help to user to find a house, if user add a budget for house, get this information.",
  parameters: {
    type: 'object',
    description: "Return budget for the house",
    properties: {
      budget: {
        type: 'string',
      },
    },
    required: ['budget']
  }
}

const toolsAmenities = {
  name: "getAmenities",
  description: "If user search a house, ask for amenities it's a must, if you detect some amenities, add a list of this.",
  parameters: {
    type: 'object',
    description: "Return budget for the house",
    properties: {
      amenities: {
        type: 'string',
      },
    },
    required: ['amenities']
  }
}

// ...existing code...
export const generalTools = {
  tools: [toolsName, toolsLocation, toolsBudget, toolsAmenities],
  listTools: [toolsName.name, toolsLocation.name, toolsBudget.name, toolsAmenities.name]
};