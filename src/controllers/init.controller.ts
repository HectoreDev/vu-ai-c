import { Request, Response } from "express";
import { mcpServer } from "../mcp/mcp.server";

export const initFlow = async (req: Request, res: Response) => {
    const result = await mcpServer.callTool("init", { data: {} });
    console.log(result);
    res.json({ success: true, data: result });
};