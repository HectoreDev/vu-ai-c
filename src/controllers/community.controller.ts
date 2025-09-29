import { Request, Response } from "express";
import { communitySchema } from "../schemas/community.schema";
import { communityInfoSchema } from "../schemas/communityInfo.schema";
import { mcpServer } from "../mcp-llm/mcp.server";

// export const getCommunities = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const communityData = communitySchema.parse(req.body);
//         const resCheckSession = await mcpServer.callTool("check-session", { data: communityData });
//         console.log(resCheckSession);
//         if (!resCheckSession.success) {
//             res.status(400).json({ success: false, error: resCheckSession.error });
//             return;
//         }
//         const result = await mcpServer.callTool("get-communities", { data: communityData });
//         res.json({ success: true, data: result });
//     } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
//         res.status(400).json({ success: false, error: errorMessage });
//     }
// };

// export const getCommunityInfo = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const communityInfoData = communityInfoSchema.parse(req.body);
//         const resCheckSession = await mcpServer.callTool("check-session", { data: communityInfoData });
//         console.log(resCheckSession);
//         if (!resCheckSession.success) {
//             res.status(400).json({ success: false, error: resCheckSession.error });
//             return;
//         }
//         const result = await mcpServer.callTool("get-community-info", { data: communityInfoData });
//         res.json({ success: true, data: result });
//     } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
//         res.status(400).json({ success: false, error: errorMessage });
//     }
// };