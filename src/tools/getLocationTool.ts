import { checkSession } from "./checkSession";
import { Tool } from "./tool.interface";

export class getLocationTool implements Tool {
    async execute(data: any) {
        checkSession(data);
        return { ...data, message: "Location obtenido correctamente" };
    }
}
