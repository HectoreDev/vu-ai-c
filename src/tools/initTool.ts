import { checkSession } from "./checkSession";
import { Tool } from "./tool.interface";

export class initTool implements Tool {
    async execute(data: any) {
        checkSession(data);
        return { ...data, message: "CommunityTool ejecutada correctamente" };
    }
}
