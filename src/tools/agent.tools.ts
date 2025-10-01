import { FunctionDeclaration, Type } from "@google/genai";

const toolSchema: Record<string, FunctionDeclaration> = {
  getName: {
    name: "getName",
    description:
      "Obten el nombre del usuario si lo ha agregado y solo regresa el nombre",
    parameters: {
      type: Type.OBJECT,
      properties: {
        name: {
          type: Type.STRING,
          description: "Retorna el nombre que ha brindado el usuario",
        },
      },
      required: ["name"],
    },
  },
  getLocation: {
    name: "getLocation",
    description:
      "Sí el usuario ha añadido una ciudad o estado, obten la información del lugar o lugares y añadelas en el array, Comma/semicolon separated list of features",
    parameters: {
      type: Type.OBJECT,
      properties: {
        locations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Añade locaciones las locations en un array",
        },
      },
      required: ["locations"],
    },
  },
  getBudget: {
    name: "getBudget",
    description:
      "Establece el presupuesto del usuario SOLO con priceMin y priceMax. Si el usuario proporciona un precio único, úsalo para ambos campos. Reglas: priceMin [300000, 3000000] y priceMax ≥ priceMin. no aceptes numeros con sufijos k/m (p. ej., '550k', '1.2m'). Si falta sessionId, la tool debe devolver ok:false sugiriendo pedir el nombre para iniciar sesión.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: { type: Type.STRING },
        priceMin: {
          type: Type.STRING,
          description:
            "Precio mínimo del rango. Si el usuario dio un solo precio, repítelo aquí y en priceMax. Debe estar entre 300000 y 3000000.",
        },
        priceMax: {
          type: Type.STRING,
          description:
            "Precio máximo del rango. Debe ser mayor o igual a priceMin.",
        },
      },
      required: ["priceMin", "priceMax"],
    },
  },
  getAmenities: {
    name: "getAmenities",
    description:
      "If user search a house, ask for amenities it's a must, if you detect some amenities, add a list of this.",
    parameters: {
      type: Type.OBJECT,
      description: "Return budget for the house",
      properties: {
        amenities: {
          type: Type.STRING,
        },
      },
      required: ["amenities"],
    },
  },
  getInterestFindHome: {
    name: "getInterestFindHome",
    description:
      "Persist the user's motivations for finding a home. Accepts 'interest' or 'interests' (array or string). If 'sessionId' is missing, returns ok:false and suggests asking for the user's name to start a session.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description:
            "Required. If missing, the tool responds with a suggestion to capture the user's name.",
        },
        interests: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Array of interest tags.",
        },
      },
    },
  },
  getInterestRate: {
    name: "getInterestRate",
    description:
      "Persist the selected financing product: 'fha_30', 'conventional_30', or null if declined. Accepts 'interestRateType' strings. If 'sessionId' is missing, returns ok:false and suggests asking the user's name.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description:
            "Required. If missing, the tool will suggest asking the user's name to start a session.",
        },
        interestRateType: {
          type: Type.STRING,
          description:
            "Free text like 'FHA', 'Conventional', 'no', 'skip', value: 'fha_30' | 'conventional_30' | 'null' (to explicitly clear),",
        },
      },
    },
  },
  getCustomizing: {
    name: "getCustomizing",
    description:
      "Persist whether the user is interested in customizable homes. Accepts {customizing:boolean} or {answer|label} free-text return boolean. Requires sessionId. If missing, returns ok:false and suggests asking for the user's name.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description:
            "Required. If missing, the tool will suggest asking for the user's name.",
        },
        customizing: {
          type: Type.BOOLEAN,
          description:
            "true if interested, false otherwise, Free text like 'yes', 'no', 'not today'.",
        },
      },
    },
  },
  getMoveInReady: {
    name: "getMoveInReady",
    description:
      "Persist whether to include homes ready for quick move-in. Accepts {moveInReady:boolean} or text return boolean. Requires sessionId.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description:
            "Required. If missing, the tool will suggest asking for the user's name.",
        },
        moveInReady: {
          type: Type.BOOLEAN,
          description:
            "true to include quick move-ins, false to exclude and Free text like 'yes, include', 'no, not now'.",
        },
      },
    },
  },
  getRenting: {
    name: "getRenting",
    description:
      "Persist whether to include homes available for rent. Accepts {renting:boolean} or text return boolean. Requires sessionId.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description:
            "Required. If missing, the tool will suggest asking for the user's name.",
        },
        renting: {
          type: Type.BOOLEAN,
          description:
            "true to include rentals, false to exclude, Free text like 'yes, include rentals' or 'no, not now'..",
        },
      },
    },
  },
  getFloorplanSpecs: {
    name: "getFloorplanSpecs",
    description:
      "Persist floorplan specs with partial input. Omitted dimensions are stored as null. Requires sessionId.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: "Required session id.",
        },

        sqft: {
          type: Type.STRING,
          description: "Single value → min & max for square_footage",
        },
        sqft_min: { type: Type.STRING },
        sqft_max: { type: Type.STRING },

        bed: {
          type: Type.STRING,
          description: "Single value → min & max for bedroom_count",
        },
        bedrooms: { type: Type.STRING },
        bed_min: { type: Type.STRING },
        bed_max: { type: Type.STRING },

        bath: {
          type: Type.STRING,
          description: "Single value → min & max for bathroom_count",
        },
        baths: { type: Type.STRING },
        bath_min: { type: Type.STRING },
        bath_max: { type: Type.STRING },

        garage: {
          type: Type.STRING,
          description: "Single value → min & max for garage_size",
        },
        garages: { type: Type.STRING },
        garage_min: { type: Type.STRING },
        garage_max: { type: Type.STRING },

        floorplanSpecs: {
          type: Type.OBJECT,
          properties: {
            sqft: { type: Type.STRING },
            sqft_min: { type: Type.STRING },
            sqft_max: { type: Type.STRING },
            bed: { type: Type.STRING },
            bedrooms: { type: Type.STRING },
            bed_min: { type: Type.STRING },
            bed_max: { type: Type.STRING },
            bath: { type: Type.STRING },
            baths: { type: Type.STRING },
            bath_min: { type: Type.STRING },
            bath_max: { type: Type.STRING },
            garage: { type: Type.STRING },
            garages: { type: Type.STRING },
            garage_min: { type: Type.STRING },
            garage_max: { type: Type.STRING },
          },
        },
      },
    },
  },
  getInterestedHome: {
    name: "getInterestedHome",
    description:
      "Persist the user's must-have home features (free-form, no fixed catalog). Accepts features via multiple aliases. Requires sessionId.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: "Required session id.",
        },
        homeInterest: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "Alias for features, Comma/semicolon separated list of features",
        },
      },
    },
  },
  searchCommmunity: {
    name: "searchCommmunity",
    description:
      "Search communities using filters from the session (markets and budget). If missing, suggests collecting them.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description:
            "Required session id used to read filters from the store.",
        },
      },
      required: ["sessionId"],
    },
  },
};

export type ToolTypes = keyof typeof toolSchema;

export const tools = Object.values(toolSchema);

export const toolsNames = Object.keys(toolSchema);



