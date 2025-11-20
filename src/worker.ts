// src/worker.ts
import {
  chatWithGeminiLogic,
  GeminiRequestBody,
} from "./controllers/chatLogic";

export default {
  async fetch(
    request: Request,
    env: any,
    ctx: ExecutionContext
  ): Promise<Response> {
    console.log("DEV in page in");
    
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    if (
      request.method === "POST" &&
      new URL(request.url).pathname === "/gemini/chat"
    ) {
      const body = (await request.json()) as GeminiRequestBody;
      const { text, history, lang, sessionId } = body;

      const result = await chatWithGeminiLogic({
        text,
        history,
        lang,
        sessionId,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // healthcheck
    if (request.method === "GET" && new URL(request.url).pathname === "/") {
      return new Response(
        JSON.stringify({
          message: "Server running!",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    return new Response("Not found", { status: 404 });
  },
};
