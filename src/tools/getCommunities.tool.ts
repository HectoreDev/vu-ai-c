import { Tool } from "./tool.interface";
import { checkSession } from "./checkSession";

export class getCommunitiesTool implements Tool {
    async execute(data: any) {
        checkSession(data);
        return { ...data, message: "findCommunitiesTool ejecutada correctamente" };
    }
}