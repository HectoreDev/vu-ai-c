import { Tool } from "./tool.interface";

function generateSessionId() {
    return Math.floor(Math.random() * 1000000); // id simple aleatorio
}

export class SessionTool implements Tool {
    async execute(data: any) {
        const sessionId = generateSessionId();
        return { ...data, id: sessionId, message: "Session iniciada correctamente" };
    }
} 