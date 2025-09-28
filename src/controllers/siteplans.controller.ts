import { Request, Response } from "express";
import { siteplansSchema } from "../schemas/siteplans.schema";
import { mcpServer } from "../mcp-llm/mcp.server";

export const getSiteplans = async (req: Request, res: Response) => {
  try {
    const siteplansData = siteplansSchema.parse(req.body);
    console.log(siteplansData);
    /* const resCheckSession = await mcpServer.callTool("check-session", { data: siteplansData });
    console.log(resCheckSession);
    if (!resCheckSession.success) {
      res.status(400).json({ success: false, error: resCheckSession.error });
    } */
    const result = await mcpServer.callTool("get-siteplans", { data: siteplansData });
    res.json({ success: true, data: result });
  } catch (error) {

    res.status(400).json({ success: false, error: JSON.parse(error as string) });
  }
}