import { Tool } from "./tool.interface";
import { checkSession } from "./checkSession";

export class CommunityTool implements Tool {
    async execute(data: any) {
        checkSession(data);
        return { ...data, message: "CommunityTool ejecutada correctamente" };
    }
}
