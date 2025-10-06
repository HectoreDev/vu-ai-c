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

const toolsBudget = {
  name: "getBudget",
  description: "Sí el usuario ha mencionado un presupuesto para la casa, obten el presupuesto y solo regresa el presupuesto en números. El usuario podría dar un mínimo, un máximo o ambos. Sí solo da un número, ese tomara el mínimo y el máximo.",
  parameters: {
    type: 'object',
    description: "Retorna el presupuesto en números",
    properties: {
      priceMin: {
        type: 'string',
      },
      priceMax: {
        type: 'string',
      },
    },
    required: ['priceMin', 'priceMax']
  }
}

const toolsAmenities = {
  name: "getAmenities",
  description: "Sí el usuario busca una casa, pregunta por las amenidades que son imprescindibles, si detectas algunas amenidades, añadelas en una lista.",
  parameters: {
    type: 'object',
    description: "Añade las amenidades en un array",
    properties: {
      amenities: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['amenities']
  }
}

const toolsLocation = {
  name: "getLocation",
  description: "Sí el usuario ha añadido una ciudad o estado, obten la información del lugar",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: 'array',
        items: { type: 'string' },
        description: "Añade locación o las locaciones en un array",
      },
    },
    required: ["location"],
  },
};

export const generalTools = {
  tools: [toolsName, toolsBudget, toolsAmenities, toolsLocation],
  listTools: [toolsName.name, toolsBudget.name, toolsAmenities.name, toolsLocation.name]
};