import {
    executeGetNameTool, executeGetLocationTool, executeSessionTool,
    executeGetCommunitiesTool, executeGetCommunityInfoTool, executeCheckSessionTool,
    executeSiteplansTool, executeGetFloorplansTool, executeGetMinMaxPricesTool,
    executeGetAmenitiesFromPricesTool
} from "./mcp.tools";

export class SimpleMcpServer {
    private tools: Map<string, Function> = new Map();

    constructor() {
        this.tools.set("get-name", executeGetNameTool);
        this.tools.set("get-location", executeGetLocationTool);
        this.tools.set("get-min-max-prices", executeGetMinMaxPricesTool);
        this.tools.set("get-amenities-from-prices", executeGetAmenitiesFromPricesTool);
        this.tools.set("session-start", executeSessionTool);
        this.tools.set("get-communities", executeGetCommunitiesTool);
        this.tools.set("get-community-info", executeGetCommunityInfoTool);
        this.tools.set("get-siteplans", executeSiteplansTool);
        this.tools.set("get-floorplans", executeGetFloorplansTool);
        this.tools.set("check-session", executeCheckSessionTool);
    }

    async callTool(name: string, args: any) {
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

