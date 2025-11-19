import { FunctionDeclaration, Type } from "@google/genai";
import { prompts, propertiesPrompts } from "../prompts/prompts";
import { Lang } from "../types/types";
import { tPrompts, tProperties } from "../controllers/i18n";

export function createToolSchema(lang: Lang): Record<string, FunctionDeclaration> {
  return {
    getName: {
      name: "getName",
      description: tPrompts("getNamePrompt", lang) as string,
      parameters: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: tProperties("nameDescription", lang) as string,
          },
        },
        required: ["name"],
      },
    },

    getLocations: {
      name: "getLocations",
      description: tPrompts("getLocationsPrompt", lang) as string,
      parameters: {
        type: Type.OBJECT,
        properties: {
          locations: {
            type: Type.ARRAY,
            description: tProperties("locationsDescription", lang) as string,
            items: {
              type: Type.OBJECT,
              properties: {
                state: {
                  type: Type.STRING,
                  description: tProperties("stateDescription", lang) as string,
                },
                location: {
                  type: Type.STRING,
                  description: tProperties("locationDescription", lang) as string,
                },
                zip: {
                  type: Type.STRING,
                  description: tProperties("zipDescription", lang) as string,
                },
              },
            },
          },
        },
        required: ["locations"],
      },
    },

    getBudget: {
      name: "getBudget",
      description: tPrompts("getBudgetPrompt", lang) as string,
      parameters: {
        type: Type.OBJECT,
        properties: {
          priceMin: {
            type: Type.STRING,
            description: tProperties("priceMinDescription", lang) as string,
          },
          priceMax: {
            type: Type.STRING,
            description: tProperties("priceMaxDescription", lang) as string,
          },
        },
        required: ["priceMin", "priceMax"],
      },
    },

    getAmenities: {
      name: "getAmenities",
      description: tPrompts("getAmenitiesPrompt", lang) as string,
      parameters: {
        type: Type.OBJECT,
        properties: {
          amenities: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: tProperties("amenitiesDescription", lang) as string,
          },
        },
        required: ["amenities"],
      },
    },

    getInterestFindHome: {
      name: "getInterestFindHome",
      description: tPrompts("getInterestFindHomePrompt", lang) as string,
      parameters: {
        type: Type.OBJECT,
        properties: {
          interestFindHome: {
            type: Type.STRING,
            description: tProperties("interestsFindHomeDescription", lang) as string,
          },
        },
        required: ["interestFindHome"],
      },
    },

    getInterestRateType: {
      name: "getInterestRateType",
      description: tPrompts("getInterestRateTypePrompt", lang) as string,
      parameters: {
        type: Type.OBJECT,
        properties: {
          interestRateType: {
            type: Type.STRING,
            description: tProperties("interestRateType", lang) as string,
          },
        },
        required: ["interestRateType"],
      },
    },

    getCustomizing: {
      name: "getCustomizing",
      description: tPrompts("getCustomizingPrompt", lang) as string,
      parameters: {
        type: Type.OBJECT,
        properties: {
          customizing: {
            type: Type.BOOLEAN,
            description: tProperties("customizingDescription", lang) as string,
          },
        },
        required: ["customizing"],
      },
    },

    getMoveInReady: {
      name: "getMoveInReady",
      description: tPrompts("getMoveInReadyPrompt", lang) as string,
      parameters: {
        type: Type.OBJECT,
        properties: {
          moveInReady: {
            type: Type.BOOLEAN,
            description: tProperties("moveInReadyDescription", lang) as string,
          },
        },
        required: ["moveInReady"],
      },
    },

    getRenting: {
      name: "getRenting",
      description: tPrompts("getRentingPrompt", lang) as string,
      parameters: {
        type: Type.OBJECT,
        properties: {
          renting: {
            type: Type.BOOLEAN,
            description: tProperties("rentingDescription", lang) as string,
          },
        },
        required: ["renting"],
      },
    },

    getFloorplanBed: {
      name: "getFloorplanBed",
      description: tPrompts("getFloorplanBedPrompt", lang) as string,
      parameters: {
        type: Type.OBJECT,
        properties: {
          bed_min: {
            type: Type.NUMBER,
            description: tProperties("bedMinDescription", lang) as string,
          },
          bed_max: {
            type: Type.NUMBER,
            description: tProperties("bedMaxDescription", lang) as string,
          },
        },
        required: ["bed_min", "bed_max"],
      },
    },

    getFloorplanBath: {
      name: "getFloorplanBath",
      description: tPrompts("getFloorplanBathPrompt", lang) as string,
      parameters: {
        type: Type.OBJECT,
        properties: {
          bath_min: {
            type: Type.NUMBER,
            description: tProperties("bathMinDescription", lang) as string,
          },
          bath_max: {
            type: Type.NUMBER,
            description: tProperties("bathMaxDescription", lang) as string,
          },
        },
        required: ["bath_min", "bath_max"],
      },
    },

    getFloorplanSqft: {
      name: "getFloorplanSqft",
      description: tPrompts("getFloorplanSqftPrompt", lang) as string,
      parameters: {
        type: Type.OBJECT,
        properties: {
          sqft_min: {
            type: Type.NUMBER,
            description: tProperties("sqftMinDescription", lang)as string,
          },
          sqft_max: {
            type: Type.NUMBER,
            description: tProperties("sqftMaxDescription", lang) as string,
          },
        },
        required: ["sqft_min", "sqft_max"],
      },
    },

    getFloorplanGarage: {
      name: "getFloorplanGarage",
      description: tPrompts("getFloorplanGaragePrompt", lang) as string,
      parameters: {
        type: Type.OBJECT,
        properties: {
          garage_min: {
            type: Type.NUMBER,
            description: tProperties("garageMinDescription", lang) as string,
          },
          garage_max: {
            type: Type.NUMBER,
            description: tProperties("garageMaxDescription", lang) as string,
          },
        },
        required: ["garage_min", "garage_max"],
      },
    },

    getFloorplanLevel: {
      name: "getFloorplanLevel",
      description: tPrompts("getFloorplanLevelPrompt", lang) as string,
      parameters: {
        type: Type.OBJECT,
        properties: {
          level_min: {
            type: Type.NUMBER,
            description: tProperties("levelMinDescription", lang) as string,
          },
          level_max: {
            type: Type.NUMBER,
            description: tProperties("levelMaxDescription", lang) as string,
          },
        },
        required: ["level_min", "level_max"],
      },
    },

    getInterestedHome: {
      name: "getInterestedHome",
      description: tPrompts("getInterestedHomePrompt", lang) as string,
      parameters: {
        type: Type.OBJECT,
        properties: {
          interestedHome: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: tProperties("homeInterestDescription", lang) as string,
          },
        },
        required: ["interestedHome"],
      },
    },

    // Si reactivas searchCommunity:
    // searchCommmunity: {
    //   name: "searchCommmunity",
    //   description: tPrompts("searchCommunityPrompt", lang) as string,
    //   parameters: {
    //     type: Type.OBJECT,
    //     properties: {
    //       sessionId: {
    //         type: Type.STRING,
    //         description: tProperties("sessionIdDescription", lang) as string,
    //       },
    //     },
    //     required: ["sessionId"],
    //   },
    // },
  };
}

// const toolSchema: Record<string, FunctionDeclaration> = {
//   getName: {
//     name: "getName",
//     description: prompts.getNamePrompt,
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         // sessionId: {
//         //   type: Type.STRING,
//         //   description: propertiesPrompts.sessionIdDescription,
//         // },
//         name: {
//           type: Type.STRING,
//           description: propertiesPrompts.nameDescription,
//         },
//       },
//       required: ["name"],
//     },
    
//   },
//   getLocations: {
//     name: "getLocations",
//     description: prompts.getLocationsPrompt,
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         // sessionId: {
//         //   type: Type.STRING,
//         //   description: propertiesPrompts.sessionIdDescription,
//         // },
//         locations: {
        
//           type: Type.ARRAY,
//           description: propertiesPrompts.locationsDescription,
//           items: {
//             type: Type.OBJECT,
//             properties: {
//               state:{
//                 type: Type.STRING,
//                 description: propertiesPrompts.stateDescription
//               },
//               location:{
//                 type: Type.STRING,
//                 description: propertiesPrompts.locationDescription
//               },
//               zip: {
//                 type: Type.STRING,
//                 description: propertiesPrompts.zipDescription
//               }
//             }
//           },
//         },
    
//       },
    
//       required: ["locations"],
//     },
//   },
//   getBudget: {
//     name: "getBudget",
//     description: prompts.getBudgetPrompt,
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         // sessionId: {
//         //   type: Type.STRING,
//         //   description: propertiesPrompts.sessionIdDescription,
//         // },
//         priceMin: {
//           type: Type.STRING,
//           description: propertiesPrompts.priceMinDescription,
//         },
//         priceMax: {
//           type: Type.STRING,
//           description: propertiesPrompts.priceMaxDescription,
//         },
//       },
//       required: ["priceMin", "priceMax"],
//     },
//   },
//   getAmenities: {
//     name: "getAmenities",
//     description: prompts.getAmenitiesPrompt,
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         // sessionId: {
//         //   type: Type.STRING,
//         //   description: propertiesPrompts.sessionIdDescription,
//         // },
//         amenities: {
//           type: Type.ARRAY,
//           items: { type: Type.STRING },
//           description: propertiesPrompts.amenitiesDescription,
//         },
//       },
//       required: ["amenities"],
//     },
//   },
//   getInterestFindHome: {
//     name: "getInterestFindHome",
//     description: prompts.getInterestFindHomePrompt,
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         // sessionId: {
//         //   type: Type.STRING,
//         //   description: propertiesPrompts.sessionIdDescription,
//         // },
//         interestFindHome: {
//           type: Type.STRING,
//           // items: { type: Type.STRING },
//           description: propertiesPrompts.interestsFindHomeDescription,
//         },
//       },
//       required: ["interestFindHome"],
//     },
//   },
//   getInterestRateType: {
//     name: "getInterestRateType",
//     description: prompts.getInterestRateTypePrompt,
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         // sessionId: {
//         //   type: Type.STRING,
//         //   description: propertiesPrompts.sessionIdDescription,
//         // },
//         interestRateType: {
//           type: Type.STRING,
//           description: propertiesPrompts.interestRateType,
//         },
//       },
//       required: ["interestRateType"],

//     },
//   },
//   getCustomizing: {
//     name: "getCustomizing",
//     description: prompts.getCustomizingPrompt,
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         // sessionId: {
//         //   type: Type.STRING,
//         //   description: propertiesPrompts.sessionIdDescription,
//         // },
//         customizing: {
//           type: Type.BOOLEAN,
//           description: propertiesPrompts.customizingDescription,
//         },
//       },
//        required: ["customizing"],
//     },
//   },
//   getMoveInReady: {
//     name: "getMoveInReady",
//     description: prompts.getMoveInReadyPrompt,
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         // sessionId: {
//         //   type: Type.STRING,
//         //   description: propertiesPrompts.sessionIdDescription,
//         // },
//         moveInReady: {
//           type: Type.BOOLEAN,
//           description: propertiesPrompts.moveInReadyDescription,
//         },
//       },
//       required: ["moveInReady"],
//     },
//   },
//   getRenting: {
//     name: "getRenting",
//     description: prompts.getRentingPrompt,
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         // sessionId: {
//         //   type: Type.STRING,
//         //   description: propertiesPrompts.sessionIdDescription,
//         // },
//         renting: {
//           type: Type.BOOLEAN,
//           description: propertiesPrompts.rentingDescription,
//         },
//       },
//       required: ["renting"],
//     },
//   },
//   getFloorplanBed: {
//     name: "getFloorplanBed",
//     description: prompts.getFloorplanBedPrompt,
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         // sessionId: {
//         //   type: Type.STRING,
//         //   description: propertiesPrompts.sessionIdDescription,
//         // },
//         bed_min: {
//           type: Type.NUMBER,
//           description: propertiesPrompts.bedMinDescription,
//         },
//         bed_max: {
//           type: Type.NUMBER,
//           description: propertiesPrompts.bedMaxDescription,
//         },
//       },
//       required:["bed_min", "bed_max"]
//     },
//   },
//   getFloorplanBath: {
//     name: "getFloorplanBath",
//     description: prompts.getFloorplanBathPrompt,
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         // sessionId: {
//         //   type: Type.STRING,
//         //   description: propertiesPrompts.sessionIdDescription,
//         // },
//         bath_min: {
//           type: Type.NUMBER,
//           description: propertiesPrompts.bathMinDescription,
//         },
//         bath_max: {
//           type: Type.NUMBER,
//           description: propertiesPrompts.bathMaxDescription,
//         },
//       },
//       required:["bath_min", "bath_max"]
//     },
//   },
//   getFloorplanSqft: {
//     name: "getFloorplanSqft",
//     description: prompts.getFloorplanSqftPrompt,
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         // sessionId: {
//         //   type: Type.STRING,
//         //   description: propertiesPrompts.sessionIdDescription,
//         // },
//         sqft_min: {
//           type: Type.NUMBER,
//           description: propertiesPrompts.sqftMinDescription,
//         },
//         sqft_max: {
//           type: Type.NUMBER,
//           description: propertiesPrompts.sqftMaxDescription,
//         },
//       },
//       required:["sqft_min", "sqft_max"]
//     },
//   },
//   getFloorplanGarage: {
//     name: "getFloorplanGarage",
//     description: prompts.getFloorplanGaragePrompt,
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         // sessionId: {
//         //   type: Type.STRING,
//         //   description: propertiesPrompts.sessionIdDescription,
//         // },
//         garage_min: {
//           type: Type.NUMBER,
//           description: propertiesPrompts.garageMinDescription,
//         },
//         garage_max: {
//           type: Type.NUMBER,
//           description: propertiesPrompts.garageMaxDescription,
//         },
//       },
//       required:["garage_min", "garage_max"]
//     },
//   },
//   getFloorplanLevel: {
//     name: "getFloorplanLevel",
//     description: prompts.getFloorplanLevelPrompt,
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         // sessionId: {
//         //   type: Type.STRING,
//         //   description: propertiesPrompts.sessionIdDescription,
//         // },
//         level_min: {
//           type: Type.NUMBER,
//           description: propertiesPrompts.levelMinDescription,
//         },
//         level_max: {
//           type: Type.NUMBER,
//           description: propertiesPrompts.levelMaxDescription,
//         },
//       },
//       required:["level_min", "level_max"]
//     },
//   },
//   getInterestedHome: {
//     name: "getInterestedHome",
//     description: prompts.getInterestedHomePrompt,
//     parameters: {
//       type: Type.OBJECT,
//       properties: {
//         // sessionId: {
//         //   type: Type.STRING,
//         //   description: propertiesPrompts.sessionIdDescription,
//         // },
//         interestedHome: {
//           type: Type.ARRAY,
//           items: { type: Type.STRING },
//           description: propertiesPrompts.homeInterestDescription,
//         },
//       },
//       required:["interestedHome"]
//     },
//   },
//   // searchCommmunity: {
//   //   name: "searchCommmunity",
//   //   description: prompts.searchCommunityPrompt,
//   //   parameters: {
//   //     type: Type.OBJECT,
//   //     properties: {
//   //       sessionId: {
//   //         type: Type.STRING,
//   //         description:  propertiesPrompts.sessionIdDescription,
//   //       },
//   //     },
//   //     required: ["sessionId"],
//   //   },
//   // },
// };

// export type ToolTypes = keyof typeof toolSchema;

// export const tools = Object.values(toolSchema);

// export const toolsNames = Object.keys(toolSchema);
