import { FunctionDeclaration, Type } from "@google/genai";
import { prompts, propertiesPrompts } from "../prompts/prompts";

const toolSchema: Record<string, FunctionDeclaration> = {
  getName: {
    name: "getName",
    description: prompts.getNamePrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: propertiesPrompts.sessionIdDescription,
        },
        name: {
          type: Type.STRING,
          description: propertiesPrompts.nameDescription,
        },
      },
      required: ["name"],
    },
  },
  getLocations: {
    name: "getLocations",
    description: prompts.getLocationsPrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: propertiesPrompts.sessionIdDescription,
        },
        locations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: propertiesPrompts.locationsDescription,
        },
      },
      required: ["locations"],
    },
  },
  getBudget: {
    name: "getBudget",
    description: prompts.getBudgetPrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: propertiesPrompts.sessionIdDescription,
        },
        priceMin: {
          type: Type.STRING,
          description: propertiesPrompts.priceMinDescription,
        },
        priceMax: {
          type: Type.STRING,
          description: propertiesPrompts.priceMaxDescription,
        },
      },
      required: ["priceMin", "priceMax"],
    },
  },
  getAmenities: {
    name: "getAmenities",
    description: prompts.getAmenitiesPrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: propertiesPrompts.sessionIdDescription,
        },
        amenities: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: propertiesPrompts.amenitiesDescription,
        },
      },
      required: ["amenities"],
    },
  },
  getInterestFindHome: {
    name: "getInterestFindHome",
    description: prompts.getInterestFindHomePrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: propertiesPrompts.sessionIdDescription,
        },
        interestFindHome: {
          type: Type.STRING,
          // items: { type: Type.STRING },
          description: propertiesPrompts.interestsFindHomeDescription,
        },
      },
    },
  },
  getInterestRateType: {
    name: "getInterestRateType",
    description: prompts.getInterestRateTypePrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: propertiesPrompts.sessionIdDescription,
        },
        interestRateType: {
          type: Type.STRING,
          description: propertiesPrompts.interestRateType,
        },
      },
    },
  },
  getCustomizing: {
    name: "getCustomizing",
    description: prompts.getCustomizingPrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: propertiesPrompts.sessionIdDescription,
        },
        customizing: {
          type: Type.BOOLEAN,
          description: propertiesPrompts.customizingDescription,
        },
      },
    },
  },
  getMoveInReady: {
    name: "getMoveInReady",
    description: prompts.getMoveInReadyPrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: propertiesPrompts.sessionIdDescription,
        },
        moveInReady: {
          type: Type.BOOLEAN,
          description: propertiesPrompts.moveInReadyDescription,
        },
      },
    },
  },
  getRenting: {
    name: "getRenting",
    description: prompts.getRentingPrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: propertiesPrompts.sessionIdDescription,
        },
        renting: {
          type: Type.BOOLEAN,
          description: propertiesPrompts.rentingDescription,
        },
      },
    },
  },
  getFloorplanBed: {
    name: "getFloorplanBed",
    description: prompts.getFloorplanBedPrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: propertiesPrompts.sessionIdDescription,
        },
        bed_min: {
          type: Type.NUMBER,
          description: propertiesPrompts.bedMinDescription,
        },
        bed_max: {
          type: Type.NUMBER,
          description: propertiesPrompts.bedMaxDescription,
        },
      },
    },
  },
  getFloorplanBath: {
    name: "getFloorplanBath",
    description: prompts.getFloorplanBathPrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: propertiesPrompts.sessionIdDescription,
        },
        bath_min: {
          type: Type.NUMBER,
          description: propertiesPrompts.bathMinDescription,
        },
        bath_max: {
          type: Type.NUMBER,
          description: propertiesPrompts.bathMaxDescription,
        },
      },
    },
  },
  getFloorplanSqft: {
    name: "getFloorplanSqft",
    description: prompts.getFloorplanSqftPrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: propertiesPrompts.sessionIdDescription,
        },
        sqft_min: {
          type: Type.NUMBER,
          description: propertiesPrompts.sqftMinDescription,
        },
        sqft_max: {
          type: Type.NUMBER,
          description: propertiesPrompts.sqftMaxDescription,
        },
      },
    },
  },
  getFloorplanGarage: {
    name: "getFloorplanGarage",
    description: prompts.getFloorplanGaragePrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: propertiesPrompts.sessionIdDescription,
        },
        garage_min: {
          type: Type.NUMBER,
          description: propertiesPrompts.garageMinDescription,
        },
        garage_max: {
          type: Type.NUMBER,
          description: propertiesPrompts.garageMaxDescription,
        },
      },
    },
  },
  getFloorplanLevel: {
    name: "getFloorplanLevel",
    description: prompts.getFloorplanLevelPrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: propertiesPrompts.sessionIdDescription,
        },
        level_min: {
          type: Type.NUMBER,
          description: propertiesPrompts.levelMinDescription,
        },
        level_max: {
          type: Type.NUMBER,
          description: propertiesPrompts.levelMaxDescription,
        },
      },
    },
  },
  getInterestedHome: {
    name: "getInterestedHome",
    description: prompts.getInterestedHomePrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description: propertiesPrompts.sessionIdDescription,
        },
        interestedHome: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: propertiesPrompts.homeInterestDescription,
        },
      },
    },
  },
  searchCommmunity: {
    name: "searchCommmunity",
    description: prompts.searchCommunityPrompt,
    parameters: {
      type: Type.OBJECT,
      properties: {
        sessionId: {
          type: Type.STRING,
          description:  propertiesPrompts.sessionIdDescription,
        },
      },
      required: ["sessionId"],
    },
  },
};

export type ToolTypes = keyof typeof toolSchema;

export const tools = Object.values(toolSchema);

export const toolsNames = Object.keys(toolSchema);
