import {
  toolGetLocations,
  toolGetName,
  toolGetBudget,
  toolGetCustomizing,
  toolGetFloorplanBath,
  toolGetFloorplanBed,
  toolGetFloorplanGarage,
  toolGetFloorplanLevel,
  toolGetFloorplanSqft,
  toolGetInterestRate,
  toolGetInterestedFindHome,
  toolGetInterestedHome,
  toolGetMoveInReady,
  toolGetRenting,
  toolSearchComunities,
  toolGetAmenities,
} from "../tools";
import { Part } from "@google/genai";
import { ResponseError, ResponseSuccess } from "./types/responseType";
import { sessionStore } from "../store/zustandStore";
import { IFSuggestResponse } from "../types/types";
import { searchAlgolia } from "../functions/searchAlgolia";
import { ValidationResult } from "../schemas/store.schema";

export class SimpleMcpServer {
  private tools: Map<string, Function> = new Map();

  constructor() {
    this.tools.set("getName", toolGetName);
    this.tools.set("getLocations", toolGetLocations);
    this.tools.set("getBudget", toolGetBudget);
    this.tools.set("getCustomizing", toolGetCustomizing);
    this.tools.set("getFloorplanBed", toolGetFloorplanBed);
    this.tools.set("getFloorplanBath", toolGetFloorplanBath);
    this.tools.set("getFloorplanGarage", toolGetFloorplanGarage);
    this.tools.set("getFloorplanLevel", toolGetFloorplanLevel);
    this.tools.set("getFloorplanSqft", toolGetFloorplanSqft);
    this.tools.set("getInterestRateType", toolGetInterestRate);
    this.tools.set("getInterestFindHome", toolGetInterestedFindHome);
    this.tools.set("getInterestedHome", toolGetInterestedHome);
    this.tools.set("getAmenities", toolGetAmenities);
    this.tools.set("getMoveInReady", toolGetMoveInReady);
    this.tools.set("getRenting", toolGetRenting);
    this.tools.set("searchCommmunity", toolSearchComunities);
  }

  responseSuccess(data: any) {
    return {
      success: true,
      data,
      error: null,
    } as ResponseSuccess;
  }

  responseError(message: string) {
    return {
      success: false,
      error: message,
      data: null,
    } as ResponseError;
  }

  async callTools(tools: Part[]) {
    let results: Partial<ValidationResult<any>> = {};
    for (let index = 0; index < tools.length; index++) {
      const { functionCall } = tools[index];
      if (functionCall && functionCall.name) {
        const { name, args } = functionCall;
        const tool = this.tools.get(name);
        console.log("tool", tool);

        if (tool) {
          const result = await tool(args);
          // console.log("suggest", suggestion);

          // if(suggestion && suggestion.missing === null) {

          //   console.log('check store', store.locations, store.priceMin, store.priceMax);

          //   console.log('Buscando comunidades con Algolia...');

          //   // if(store.locations && store.locations.length > 0 && store.priceMin && store.priceMax ) {

          //   //   console.log('Buscando comunidades con Algolia...');

          //   //   const result = await searchAlgolia({
          //   //     location: store.locations,
          //   //     priceMin: store.priceMin,
          //   //     priceMax: store.priceMax
          //   //   });

          //   //   console.log('result algolia', result);

          //   //   results = {
          //   //     suggestion: result.message ? result.message : '',
          //   //     data: result.data,
          //   //     missing: null,
          //   //     nextTool: result.success ? null : 'Por favor proporciona los datos faltantes para continuar con la búsqueda.'
          //   //    };

          //   // } else {
          //   //   results = suggestion;
          //   // }

          // } else {
            // console.log('Result', result);
            
          results = {
            ...result,
          };
          // }
        }
      }
    }

    const store = sessionStore.getState();
    const suggestion = sessionStore.getState().suggest();
    // console.log("SUGGESTION FINAL MCP", suggestion);

    if (suggestion) {
      results = {
        suggest: suggestion,
      };
    }

    return {
      sessionId: store.sessionId,
      message: [{ text: results?.suggest || "" }],
      data: results.data || null,
      systemInstruction:
     
        // 'Se te ha brindado información sobre las comunidades que cumplen los requisitos del usuario. Usa esta información para sugerirle al usuario la mejor opción de casa acorde a sus necesidades y preferencias. Después de sugerir la mejor opción, pregunta si desea más información o si quiere ajustar sus criterios de búsqueda.':
        "Al usuario le faltan el siguiente dato:" +
        JSON.stringify(results?.suggest?.suggestion) +
        ". Responde al usuario de manera amigable y hazle una pregunta especifica sobre este dato faltante. Si ya encontró comunidades que cumplen sus requisitos, sugiérele la mejor opción de casa acorde a sus necesidades y preferencias.",
    };
  }

  listTools() {
    return Array.from(this.tools.keys());
  }
}

export const mcpServer = new SimpleMcpServer();
