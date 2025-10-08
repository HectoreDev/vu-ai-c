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
import { useStore } from "zustand";
import { useSessionStore } from "../store/zustandStore";

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
    const results: any[] = [];
    for (let index = 0; index < tools.length; index++) {
      const { functionCall } = tools[index];
      if (functionCall && functionCall.name) {
        const { name, args } = functionCall;
        const tool = this.tools.get(name);
        console.log("tool", tool);

        if (tool) {
          const result = await tool(args);
          results.push(result);
        }
      }
    }

    const store = useSessionStore.getState();

    // notes
    // en la respuesta trata el nombre como data crudo, necesitamos que sea un mensaje para el usuario más amigable

    const incompleteData = results.some(result => !result.success);

    if (incompleteData) {
      let text = 'El siguiente dato es requerido para continuar con la busqueda: ';
      const missingData = results.find((result) => { result.success === false; });

      text += missingData ? missingData.message : '';

      return {
        sessionId: store.sessionId,
        message: [ { text } ],
        systemInstruction: 'Al usuario le faltan el siguiente dato:' + text + '. Responde al usuario de manera amigable y hazle una pregunta sobre este dato faltante.'
      };
    } else {

      return {
        sessionId: store.sessionId,
        message: [
          {
            type: "text",
            text: `No hemos encontrado resultados que necesitas de comunidades, pero puedes probar añadiendo una nueva locacion.`,
          }
        ],
        systemInstruction: 'Con la información proporcionada, sugiere al usuario la mejor opción de casa acorde a sus necesidades y preferencias. En caso de que no encuentre casa, suguiere cambiar la locación y el presupuesto.'
      };
    }

  }

  listTools() {
    return Array.from(this.tools.keys());
  }
}

export const mcpServer = new SimpleMcpServer();
