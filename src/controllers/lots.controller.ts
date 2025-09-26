import { Request, Response } from "express";
import { lotSchema } from "../schemas/lot.schema";
import { mcpServer } from "../mcp-llm/mcp.server";

export const getLots = async (req: Request, res: Response) => {
  try {
    const lotData = lotSchema.parse(req.body);
    const resCheckSession = await mcpServer.callTool("check-session", { data: lotData });
    console.log(resCheckSession);
    if (!resCheckSession.success) {
      res.status(400).json({ success: false, error: resCheckSession.error });
    }
    const result = await mcpServer.callTool("get-communities", { data: lotData });
    res.json({ success: true, data: result });
  } catch (error) {

    res.status(400).json({ success: false, error: JSON.parse(error as string) });
  }
}