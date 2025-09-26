import { FunctionDeclaration, SchemaType } from "@google/generative-ai";

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

export const fdGetInterestRate: FunctionDeclaration = {
  name: "get_interest_rate",
  description:
    "Persist the selected financing product: 'fha_30', 'conventional_30', or null if declined. Accepts 'product' (canonical) or 'label'/'answer' strings. If 'sessionId' is missing, returns ok:false and suggests asking the user's name.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      sessionId: {
        type: SchemaType.STRING,
        description:
          "Required. If missing, the tool will suggest asking the user's name to start a session.",
      },
      product: {
        type: SchemaType.STRING,
        description:
          "Canonical value: 'fha_30' | 'conventional_30' | 'null' (to explicitly clear).",
      },
      label: {
        type: SchemaType.STRING,
        description:
          "Human label, e.g., 'FHA 30-Year Fixed Rate' or 'Conventional 30-Year Fixed Rate'.",
      },
      answer: {
        type: SchemaType.STRING,
        description: "Free text like 'FHA', 'Conventional', 'no', 'skip'.",
      },
      none: {
        type: SchemaType.BOOLEAN,
        description:
          "If true, the user declined choosing a product (store null).",
      },
    },
  },
};

export const fdSetBudget: FunctionDeclaration = {
  name: "set_budget",
  description:
    "Persist budget info (partial allowed): price_min/price_max or single price; down_payment (1-100); interest_rate (2.08-10); loan_duration (11-60). If sessionId is missing, returns ok:false and suggests asking for the user's name.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      sessionId: { type: SchemaType.STRING },

      price: {
        type: SchemaType.STRING,
        description: "Single price → applies to min & max",
      },
      price_min: { type: SchemaType.STRING },
      price_max: { type: SchemaType.STRING },

      down_payment: { type: SchemaType.STRING, description: "1–100 (%)" },
      interest_rate: { type: SchemaType.STRING, description: "2.08–10 (%)" },
      loan_duration: { type: SchemaType.STRING, description: "11–60 (years)" },

      budget: {
        type: SchemaType.OBJECT,
        properties: {
          price: { type: SchemaType.STRING },
          price_min: { type: SchemaType.STRING },
          price_max: { type: SchemaType.STRING },
          down_payment: { type: SchemaType.STRING },
          interest_rate: { type: SchemaType.STRING },
          loan_duration: { type: SchemaType.STRING },
        },
      },
    },
  },
};

export const fdCustomizing: FunctionDeclaration = {
  name: "set_customizing",
  description:
    "Persist whether the user is interested in customizable homes. Accepts {customizing:boolean} or {answer|label} free-text. Requires sessionId. If missing, returns ok:false and suggests asking for the user's name.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      sessionId: {
        type: SchemaType.STRING,
        description:
          "Required. If missing, the tool will suggest asking for the user's name.",
      },
      customizing: {
        type: SchemaType.BOOLEAN,
        description: "true if interested, false otherwise.",
      },
      answer: {
        type: SchemaType.STRING,
        description: "Free text like 'yes', 'no', 'not today'.",
      },
      label: {
        type: SchemaType.STRING,
        description:
          "UI label text the user clicked, e.g., 'Yes, interested in customizing'.",
      },
    },
  },
};

export const fdMoveInReady: FunctionDeclaration = {
  name: "move_in_ready",
  description:
    "Persist whether to include homes ready for quick move-in. Accepts {moveInReady:boolean} or text via {answer|label}. Requires sessionId.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      sessionId: {
        type: SchemaType.STRING,
        description:
          "Required. If missing, the tool will suggest asking for the user's name.",
      },
      moveInReady: {
        type: SchemaType.BOOLEAN,
        description: "true to include quick move-ins, false to exclude.",
      },
      answer: {
        type: SchemaType.STRING,
        description: "Free text like 'yes, include', 'no, not now'.",
      },
      label: {
        type: SchemaType.STRING,
        description: "UI label clicked by the user.",
      },
    },
  },
};

export const fdSetRenting: FunctionDeclaration = {
  name: "set_renting",
  description:
    "Persist whether to include homes available for rent. Accepts {renting:boolean} or text via {answer|label}. Requires sessionId.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      sessionId: {
        type: SchemaType.STRING,
        description:
          "Required. If missing, the tool will suggest asking for the user's name.",
      },
      renting: {
        type: SchemaType.BOOLEAN,
        description: "true to include rentals, false to exclude.",
      },
      answer: {
        type: SchemaType.STRING,
        description: "Free text like 'yes, include rentals' or 'no, not now'.",
      },
      label: {
        type: SchemaType.STRING,
        description: "UI label clicked by the user.",
      },
    },
  },
};

export const fdSetFloorplanSpecs: FunctionDeclaration = {
  name: "set_floorplan_specs",
  description:
    "Persist floorplan specs with partial input. Omitted dimensions are stored as null. Requires sessionId.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      sessionId: {
        type: SchemaType.STRING,
        description: "Required session id.",
      },

      sqft: {
        type: SchemaType.STRING,
        description: "Single value → min & max for square_footage",
      },
      sqft_min: { type: SchemaType.STRING },
      sqft_max: { type: SchemaType.STRING },

      bed: {
        type: SchemaType.STRING,
        description: "Single value → min & max for bedroom_count",
      },
      bedrooms: { type: SchemaType.STRING },
      bed_min: { type: SchemaType.STRING },
      bed_max: { type: SchemaType.STRING },

      bath: {
        type: SchemaType.STRING,
        description: "Single value → min & max for bathroom_count",
      },
      baths: { type: SchemaType.STRING },
      bath_min: { type: SchemaType.STRING },
      bath_max: { type: SchemaType.STRING },

      garage: {
        type: SchemaType.STRING,
        description: "Single value → min & max for garage_size",
      },
      garages: { type: SchemaType.STRING },
      garage_min: { type: SchemaType.STRING },
      garage_max: { type: SchemaType.STRING },

      floorplanSpecs: {
        type: SchemaType.OBJECT,
        properties: {
          sqft: { type: SchemaType.STRING },
          sqft_min: { type: SchemaType.STRING },
          sqft_max: { type: SchemaType.STRING },
          bed: { type: SchemaType.STRING },
          bedrooms: { type: SchemaType.STRING },
          bed_min: { type: SchemaType.STRING },
          bed_max: { type: SchemaType.STRING },
          bath: { type: SchemaType.STRING },
          baths: { type: SchemaType.STRING },
          bath_min: { type: SchemaType.STRING },
          bath_max: { type: SchemaType.STRING },
          garage: { type: SchemaType.STRING },
          garages: { type: SchemaType.STRING },
          garage_min: { type: SchemaType.STRING },
          garage_max: { type: SchemaType.STRING },
        },
      },
    },
  },
};

export const fdSetInterestingHome: FunctionDeclaration = {
  name: "set_interesting_home",
  description:
    "Persist the user's must-have home features (free-form, no fixed catalog). Accepts features via multiple aliases. Requires sessionId.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      sessionId: {
        type: SchemaType.STRING,
        description: "Required session id.",
      },
      homeInterest: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: "Alias for features.",
      },

      features_text: {
        type: SchemaType.STRING,
        description: "Comma/semicolon separated list of features.",
      },
    },
  },
};

export const fdSearchCommunities: FunctionDeclaration = {
  name: "search_communities",
  description:
    "Search communities using filters from the session (markets and budget). If missing, suggests collecting them.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      sessionId: {
        type: SchemaType.STRING,
        description: "Required session id used to read filters from the store.",
      },
    },
    required: ["sessionId"],
  },
};


// ...existing code...
export const generalTools = {
  tools: [toolsName, toolsLocation, toolsBudget, toolsAmenities, toolInterestedFindHome],
  listTools: [toolsName.name, toolsLocation.name, toolsBudget.name, toolsAmenities.name, toolInterestedFindHome.name]
};
