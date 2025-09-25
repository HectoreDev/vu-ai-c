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
  description: "Sí el usuario ha añadido una ciudad o estado, obten la información del lugar o lugares y añadelas en el array",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "array",
        items: { type: "string" },
        description: "Añade locaciones en el formato array",
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

export const toolInterestedFindHome = {
  name: "interestedFindHome",
  description:
    "Persist the user's motivations for finding a home. Accepts 'interest' or 'interests' (array or string). If 'sessionId' is missing, returns ok:false and suggests asking for the user's name to start a session.",
  parameters: {
    type: "object",
    properties: {
      sessionId: {
        type: "string",
        description: "Required. If missing, the tool responds with a suggestion to capture the user's name.",
      },
      interest: {
        type: "array",
        items: { type: "string" },
        description: "Array of interest tags.",
      }
    },
  },
};

// ...existing code...
export const generalTools = {
  tools: [toolsName, toolsLocation, toolsBudget, toolsAmenities, toolInterestedFindHome],
  listTools: [toolsName.name, toolsLocation.name, toolsBudget.name, toolsAmenities.name, toolInterestedFindHome.name]
};