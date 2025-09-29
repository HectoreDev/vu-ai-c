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
    this.tools.set("getInterestingHome", toolGetInterestingHome);
    this.tools.set("getMoveInReady", toolGetMoveInReady);
    this.tools.set("getRenting", toolGetRenting);
    this.tools.set("getSearchCommunities", toolSearchComunities);
    // this.tools.set("getBudget", executeGetMinMaxPricesTool);
    // this.tools.set("getAmenities", executeGetAmenitiesFromPricesTool);
    // this.tools.set("interesedFindHome", executeGetNameTool);
    // this.tools.set("get_amenities", executeGetAmenitiesFromPricesTool);
    // this.tools.set("start_session", executeSessionTool);
    // this.tools.set("get_communities", executeGetCommunitiesTool);
    // this.tools.set("get_community_info", executeGetCommunityInfoTool);
    // this.tools.set("get_siteplans", executeSiteplansTool);
    // this.tools.set("get_floorplans", executeGetFloorplansTool);
    // this.tools.set("check_session", executeCheckSessionTool);
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
            if (functionCall && functionCall.name) {
                const { name, args } = functionCall;
                const tool = this.tools.get(name);
                if(tool) {
                    const result =  await tool(args);
                    results.push(result);
                }
            }
        }

        const store = useSessionStore.getState();
        console.log("Resultados de las tools:", results, store);
        return this.responseSuccess(results);
    }

  listTools() {
    return Array.from(this.tools.keys());
  }
}

export const mcpServer = new SimpleMcpServer();
