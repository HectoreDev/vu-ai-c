import { Request, Response } from "express";
import { sessionSchema } from "../schemas/session.schema";
import { mcpServer } from "../mcp-llm/mcp.server";

export const startSession = async (req: Request, res: Response) => {
    try {
        const sessionData = sessionSchema.parse(req.body);
        const result = await mcpServer.callTool("session-start", { data: sessionData });

        // Verificar que el resultado sea exitoso
        if (result && result.success) {
            res.json({ success: true, data: result.data });
        } else {
            res.status(400).json({ success: false, error: 'Error al crear sesión' });
        }
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        res.status(400).json({ success: false, error: errMsg });
    }
};