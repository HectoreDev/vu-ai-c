import {
  executeGetNameTool,
  executeGetLocationTool,
  executeSessionTool,
  executeGetCommunitiesTool,
  executeGetCommunityInfoTool,
  executeCheckSessionTool,
  executeSiteplansTool,
  executeGetFloorplansTool,
  executeGetMinMaxPricesTool,
  executeGetAmenitiesFromPricesTool,
} from "./mcp.tools";
import {
  toolGetLocation,
  toolGetName,
  toolGetBudget,
  toolGetCustomizing,
  toolGetFloorplanSpecs,
  toolGetInterestRate,
  toolGetInterestedFindHome,
  toolGetInterestingHome,
  toolGetMoveInReady,
  toolGetRenting,
  toolSearchComunities,
  toolStartSession,
} from "../tools";
import { useSessionStore } from "./../store/zustandStore";
import { FunctionCall, Part } from "@google/genai";
import { ResponseError, ResponseSuccess } from "./types/responseType";
import { dataFakeCommunities } from "../db/db.testhouse";

export class SimpleMcpServer {
  private tools: Map<string, Function> = new Map();

  constructor() {
    this.tools.set("getName", toolGetName);
    this.tools.set("getLocation", toolGetLocation);
    this.tools.set("getBudget", toolGetBudget);
    this.tools.set("getCustomizing", toolGetCustomizing);
    this.tools.set("getFloorplanSpecs", toolGetFloorplanSpecs);
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
      error: null
    } as ResponseSuccess;
  }

  responseError(message: string) {
    return {
      success: false,
      error: message,
      data: null
    } as ResponseError;
  }

  async callTools(tools: Part[]) {
    const results: any[] = [];
    for (let index = 0; index < tools.length; index++) {
      const { functionCall } = tools[index];
      console.log('functionCall', functionCall);
      if (functionCall && functionCall.name) {
        const { name, args } = functionCall;
        const tool = this.tools.get(name);
        console.log('tool', tool);
        if (tool) {
          const result = await tool(args);
          console.log('result', result);
          results.push(result);
        }
      }
    }

    console.log('results', results);
    const incompleteData = results.some(result => !result.success);
    console.log('incompleteData', incompleteData);
    if (incompleteData) {
      let text = 'Faltan datos: ';
      results.forEach(result => {
        if (!result.success) {
          text += `${result.message} `;
        }
      });
      return {
        message: [ { text } ],
        systemInstruction: 'Al usuario le faltan los siguientes datos:' + text + '. Responde al usuario de manera amigable y hazle preguntas adicionales para obtener más detalles sobre sus requisitos y gustos.'
      };
    } else {

      const listOfHouse: { type: 'text', text: string }[] = dataFakeCommunities.map((lot:any) => {

        const specs = JSON.stringify(lot.amenities);

        return {
          type: "text",
          text: `Encontramos en las siguiente comunidades ${lot._origin.community.name}, con el UID ${lot._origin.community.uid}, en la ciudad de ${lot._origin.division.name}, con las siguientes amenidades: ${specs}`,
        }
      });

      return {
        message: listOfHouse,
        systemInstruction: 'Con la información proporcionada, sugiere al usuario la mejor opción de casa acorde a sus necesidades y preferencias.'
      };
    }

    // const store = useSessionStore.getState();
    // console.log("Resultados de las tools:", results, store);
    // return this.responseSuccess(results);
  }

  listTools() {
    return Array.from(this.tools.keys());
  }
}

export const mcpServer = new SimpleMcpServer();
