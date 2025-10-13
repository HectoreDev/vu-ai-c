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
  toolGetInterestingHome,
  toolGetMoveInReady,
  toolGetRenting,
  toolSearchComunities,
} from "../tools";
import { Part } from "@google/genai";
import { ResponseError, ResponseSuccess } from "./types/responseType";
import { sessionStore } from "../store/zustandStore";
import { IFSuggestResponse } from "../types/types";
import { searchAlgolia } from "../functions/searchAlgolia";

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
    this.tools.set("getInterestRate", toolGetInterestRate);
    this.tools.set("getInterestedFindHome", toolGetInterestedFindHome);
    this.tools.set("getAmenities", toolGetInterestingHome);
    this.tools.set("getMoveInReady", toolGetMoveInReady);
    this.tools.set("getRenting", toolGetRenting);
    this.tools.set("getSearchCommunities", toolSearchComunities);
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

    let results: IFSuggestResponse | null = null;
    for (let index = 0; index < tools.length; index++) {
      const { functionCall } = tools[index];
      if (functionCall && functionCall.name) {
        const { name, args } = functionCall;
        const tool = this.tools.get(name);
        console.log("tool", tool);

        if (tool) {
          const result = await tool(args);

          const store = sessionStore.getState();

          const suggestion = store.suggest();
          console.log("suggest", suggestion);

          if(suggestion && suggestion.missing === null) {

            console.log('check store', store.locations, store.priceMin, store.priceMax);

            console.log('Buscando comunidades con Algolia...');

            if(store.locations && store.locations.length > 0 && store.priceMin && store.priceMax ) {

              console.log('Buscando comunidades con Algolia...');

              const result = await searchAlgolia({
                location: store.locations,
                priceMin: store.priceMin,
                priceMax: store.priceMax
              });

              console.log('result algolia', result);

              results = { 
                suggestion: result.message ? result.message : '',
                data: result.data,
                missing: null,
                nextTool: result.success ? null : 'Por favor proporciona los datos faltantes para continuar con la búsqueda.'
               };

            } else {
              results = suggestion;
            }

          } else {
            results = suggestion;
          }

        }
      }
    }

    const store = sessionStore.getState();

    return {
      sessionId: store.sessionId,
      message: [{ text: results?.suggestion || '' }],
      data: results?.data || null,
      systemInstruction: results?.data ?
        'Se te ha brindado información sobre las comunidades que cumplen los requisitos del usuario. Usa esta información para sugerirle al usuario la mejor opción de casa acorde a sus necesidades y preferencias. Después de sugerir la mejor opción, pregunta si desea más información o si quiere ajustar sus criterios de búsqueda.':
        'Al usuario le faltan el siguiente dato:' + results?.suggestion || '' + '. Responde al usuario de manera amigable y hazle una pregunta sobre este dato faltante. Si ya encontró comunidades que cumplen sus requisitos, sugiérele la mejor opción de casa acorde a sus necesidades y preferencias.',
    };

  }

  listTools() {
    return Array.from(this.tools.keys());
  }
}

export const mcpServer = new SimpleMcpServer();
