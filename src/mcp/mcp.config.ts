import { CommunityTool } from "../tools/community.tool";
import { SessionTool } from "../tools/session.tool";
import { initTool } from "../tools/initTool";
import { getNameTool } from "../tools/getNameTool";
import { getLocationTool } from "../tools/getLocationTool";
import { getMinMaxPricesTool } from "../tools/getMinMaxPrices.tool";

export const toolRegistry = {
    start_session: new SessionTool(),
    get_name: new getNameTool(),
    get_min_max_prices: new getMinMaxPricesTool(),
    get_location: new getLocationTool(),
    init: new initTool(),
    community: new CommunityTool(),
};

export function getTool(name: keyof typeof toolRegistry) {
    return toolRegistry[name];
} 