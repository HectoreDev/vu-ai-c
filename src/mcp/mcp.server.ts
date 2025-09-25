import {
    executeGetNameTool, executeGetLocationTool, executeSessionTool,
    executeGetCommunitiesTool, executeGetCommunityInfoTool, executeCheckSessionTool,
    executeSiteplansTool, executeGetFloorplansTool, executeGetMinMaxPricesTool,
    executeGetAmenitiesFromPricesTool
} from "./mcp.tools";
import { toolSetName } from "../tools";

export class SimpleMcpServer {
    private tools: Map<string, Function> = new Map();

    constructor() {
        this.tools.set("getName", toolSetName);
        this.tools.set("getLocation", executeGetLocationTool);
        this.tools.set("getBudget", executeGetMinMaxPricesTool);
        this.tools.set("getAmenities", executeGetAmenitiesFromPricesTool);
        this.tools.set("interesedFindHome", executeGetNameTool);
        this.tools.set("get_amenities", executeGetAmenitiesFromPricesTool);
        this.tools.set("start_session", executeSessionTool);
        this.tools.set("get_communities", executeGetCommunitiesTool);
        this.tools.set("get_community_info", executeGetCommunityInfoTool);
        this.tools.set("get_siteplans", executeSiteplansTool);
        this.tools.set("get_floorplans", executeGetFloorplansTool);
        this.tools.set("check_session", executeCheckSessionTool);
    }

    async callTool(name: string, args: any) {
        console.log(`Llamando a la tool: ${name} con argumentos:`, args);
        const tool = this.tools.get(name);
        if (!tool) {
            throw new Error(`Tool ${name} not found`);
        }
        return await tool(args);
    }

    listTools() {
        return Array.from(this.tools.keys());
    }
}

export const mcpServer = new SimpleMcpServer();

