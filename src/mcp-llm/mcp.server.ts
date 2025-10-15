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
        console.log("Tool", tool);

        if (tool) {
          
          const result = await tool(args);

          results = {
            ...result,
          };
        }
      }
    }

    const store = sessionStore.getState();
    const suggestion = sessionStore.getState().suggest();

    if (suggestion) {
      results = {
        ...results,
        suggest: suggestion,
      };
    }

    console.log("communities", store.communities);

    return {
      sessionId: store.sessionId,
      message: [{ text: results?.suggest || "" }],
      data: store.communities && store.communities.length > 0 ? store.communities : null,
      systemInstruction: `INSTRUCCIONES (NO MOSTRAR):
    - sugerencia de tool para proxima pregunta: ${results.suggest?.nextTool}.
    - Falta este dato este es el suggest: ${JSON.stringify(
      results.suggest?.suggestion
    )}.
    - Pregunta SOLO por ese dato, tono cordial y por su nombre o amigo.
    - PROHIBIDO inventar, solo formular pregunta que este asociada con el suggest.
    - ${store.communities && store.communities.length > 0 ? "Ya tienes los datos de las comunidades que encontraste, sugiere las comunidades que mejor se adapten al usuario": "Sigue preguntando hasta tener todos los datos necesarios para encontrar la mejor comunidad acorde a las necesidades del usuario."}
    `,
    };
  }

  listTools() {
    return Array.from(this.tools.keys());
  }
}

export const mcpServer = new SimpleMcpServer();
