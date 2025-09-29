import { Request, Response } from "express";
import { mcpServer } from "../mcp-llm/mcp.server";
import { location } from "../schemas/location.schema";

// export const getLocation = async (req: Request, res: Response) => {
//     // Configurar timeout de 5 minutos para esta operación
//     req.setTimeout(300000);

//     const data = location.parse(req.body);
//     const result = await mcpServer.callTool("get-location", { data: data });
//     console.log(result);
//     res.json({ success: true, data: result, message: "Gracias por indicarnos tu ubicación" });
// };