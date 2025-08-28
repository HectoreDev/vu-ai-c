import { checkSession } from "./checkSession";
import { Tool } from "./tool.interface";

export class getNameTool implements Tool {
    async execute(data: any) {
        checkSession(data);
        return { ...data, message: "Nombre obtenido correctamente" };
    }
}
