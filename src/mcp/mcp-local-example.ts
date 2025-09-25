// Ejemplo: Lanzar un MCP server local y conectarlo desde Node.js
// Instala primero: npm install mcp @philschmid/weather-mcp

// import { spawn } from "child_process";
// import { ClientSession, StdioServerParameters } from "@modelcontextprotocol/sdk";

// // 1. Lanza el MCP server como proceso hijo
// const mcpProcess = spawn("npx", ["-y", "@philschmid/weather-mcp"], {
//   stdio: "pipe",
//   env: process.env,
// });

// // 2. Configura los parámetros para el cliente MCP
// const serverParams = new StdioServerParameters({
//   command: "npx",
//   args: ["-y", "@philschmid/weather-mcp"],
//   env: process.env,
// });

// // 3. Función para crear una sesión MCP y usarla como tool en Gemini
// export async function getMcpSession() {
//   const { stdio_client } = await import("mcp/client/stdio");
//   const { read, write } = await stdio_client(serverParams);
//   const session = new ClientSession(read, write);
//   await session.initialize();
//   return session;
// }

// 4. Ejemplo de uso con Gemini (ajusta según tu flujo):
// import { genAI } from "@google/generative-ai";
// const mcpSession = await getMcpSession();
// const response = await genAI.models.generateContent({
//   model: "gemini-2.5-flash",
//   contents: "Tu prompt aquí",
//   tools: [mcpSession],
// });
// console.log(response.text);

// Nota: El proceso MCP se mantendrá vivo mientras tu app esté corriendo.
// Puedes cerrar el proceso MCP con: mcpProcess.kill();
