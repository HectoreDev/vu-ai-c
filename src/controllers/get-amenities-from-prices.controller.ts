import { Request, Response } from "express";
import { mcpServer } from "../mcp-llm/mcp.server";
import { amenitiesFromPrices } from "../schemas/amenitiesfromprices";

// Endpoint de prueba simple
export const testAmenitiesConnection = async (req: Request, res: Response) => {
    try {
        console.log('🧪 Test endpoint llamado');
        const sessionData = amenitiesFromPrices.parse(req.body);
        
        // Respuesta inmediata sin procesamiento complejo
        res.json({ 
            success: true, 
            data: {
                message: "Conexión exitosa",
                sessionId: sessionData.sessionId,
                location: sessionData.location,
                priceRange: {
                    min: sessionData.priceMin,
                    max: sessionData.priceMax
                },
                timestamp: new Date().toISOString()
            },
            message: "Test de conexión exitoso" 
        });
    } catch (error) {
        console.error('❌ Error en test endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Error en test de conexión',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// export const getAmenitiesFromPrices = async (req: Request, res: Response) => {
//     // Configurar timeout de 25 minutos para esta operación
//     req.setTimeout(1500000); // 25 minutos
//     res.setTimeout(1500000); // 25 minutos
    
//     try {
      
//         const sessionData = amenitiesFromPrices.parse(req.body);
        
//         // Enviar respuesta inmediata para mantener la conexión viva
//         res.writeHead(200, {
//             'Content-Type': 'application/json',
//             'Transfer-Encoding': 'chunked',
//             'Connection': 'keep-alive',
//             'Cache-Control': 'no-cache'
//         }); 
        
//         const result = await mcpServer.callTool("get-amenities-from-prices", { data: sessionData });
        
//         // Enviar resultado final
//         res.write(JSON.stringify({ 
//             success: true, 
//             data: result, 
//             message: "Gracias por indicarnos tu rango de precios",
//             status: 'completed',
//             timestamp: new Date().toISOString()
//         }));
        
//         res.end();
        
//     } catch (error) {
//         console.error('❌ Error en getAmenitiesFromPrices:', error);
        
//         if (!res.headersSent) {
//             res.status(500).json({
//                 success: false,
//                 error: 'Error durante el procesamiento',
//                 details: error instanceof Error ? error.message : 'Unknown error'
//             });
//         } else {
//             res.write(JSON.stringify({
//                 success: false,
//                 error: 'Error durante el procesamiento',
//                 details: error instanceof Error ? error.message : 'Unknown error',
//                 status: 'error',
//                 timestamp: new Date().toISOString()
//             }));
//             res.end();
//         }
//     }
// };
 

