import { Request, Response } from "express";
import { mcpServer } from "../mcp-llm/mcp.server";

// export const getName = async (req: Request, res: Response) => {
//     const { name, sessionId, token } = req.body;
//     const result = await mcpServer.callTool("get-name", { data: { name, sessionId, token } });
//     console.log(result);
//     res.json({ success: true, data: result, message: "Gracias por indicarnos tu nombre" });
// };