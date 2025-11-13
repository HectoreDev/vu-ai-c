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
  // toolSearchComunities,
  toolGetAmenities,
} from "../tools";
import { Part } from "@google/genai";
import { ResponseError, ResponseSuccess } from "./types/responseType";
import { sessionStore } from "../store/zustandStore";
import { IFSuggestResponse } from "../types/types";
import { searchAlgolia } from "../functions/searchAlgolia";
import { ValidationResult } from "../schemas/store.schema";
import { createHandleError, createSuggestPrompt } from "../prompts/prompts";

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
    // this.tools.set("searchCommmunity", toolSearchComunities);
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

    let handleError = {
      isError: false,
      message: '',
      systemInstruction: ''
    };

    for (let index = 0; index < tools.length; index++) {
      const { functionCall } = tools[index];
      if (functionCall && functionCall.name) {
        const { name, args } = functionCall;
        const tool = this.tools.get(name);
        console.log("Tool Name", name);
        console.log("Tool", tool);

        if (tool) {
          try {
            const result = await tool(args);
            results = {
              ...result,
            };
          } catch (error) {
            handleError = createHandleError(error, name)
            console.error("Error executing tool:", error);
            break;
          }
        }
      }
    }

    const store = sessionStore.getState();
    const suggestion = sessionStore.getState().suggest();

    await sessionStore.getState().updateFilteredCommunities();

    const communities = sessionStore.getState().communities;
    const filteredCommunities = sessionStore.getState().filteredCommunities;
    const lots = sessionStore.getState().lots as any;
    const priceMin = sessionStore.getState().priceMin;
    console.log('Communities', communities);
    console.log('Filtered Communities', filteredCommunities);

    if (suggestion) {
      results = {
        ...results,
        data: priceMin && priceMin < 500000 ? lots : filteredCommunities,
        suggest: suggestion,
      };
    }

    // console.log("communities", store.communities);

    if (handleError.isError) {

      return {
        sessionId: store.sessionId,
        message: [{ text: handleError.message }],
        data: null,
        systemInstruction: handleError.systemInstruction
      };

    } else {

      return {
        sessionId: store.sessionId,
        message: [{ text: results.message || "" }],
        data: results.data,
        systemInstruction: createSuggestPrompt()
      };

    }

  }

  listTools() {
    return Array.from(this.tools.keys());
  }
}

export const mcpServer = new SimpleMcpServer();
