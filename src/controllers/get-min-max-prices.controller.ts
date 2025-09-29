import { Request, Response } from "express";
import { mcpServer } from "../mcp-llm/mcp.server";
import { minMaxPricesSchema } from "../schemas/minMaxPrices.schema";

// export const getMinMaxPrices = async (req: Request, res: Response) => {
//     const sessionData = minMaxPricesSchema.parse(req.body);
//     const result = await mcpServer.callTool("get-min-max-prices", { data: sessionData });
//     console.log(result);
//     res.json({ success: true, data: result, message: "Gracias por indicarnos tu ubicación" });
// };