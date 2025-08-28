import { Tool } from "./tool.interface";
import { checkSession } from "./checkSession";

export class getMinMaxPricesTool implements Tool {
    async execute(data: any) {
        checkSession(data);
        return { ...data, message: "getMinMaxPricesTool ejecutada correctamente" };
    }
}