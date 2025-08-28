import { Tool } from "./tool.interface";
import { checkSession } from "./checkSession";

export class getCommunityInfoTool implements Tool {
    async execute(data: any) {
        checkSession(data);
        return { ...data, message: "getCommunityInfoTool ejecutada correctamente" };
    }
}