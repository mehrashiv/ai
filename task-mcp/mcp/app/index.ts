import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { createHash } from "crypto";
import "dotenv/config";
import { z } from "zod";
import http from "http";

// --- Prisma setup ---
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// --- Auth helper ---
async function getUserFromApiKey(authHeader: string | undefined): Promise<string> {
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Missing or invalid Authorization header");

  const rawKey = authHeader.slice(7);
  const hashedKey = createHash("sha256").update(rawKey).digest("hex");

  const apiKey = await prisma.apiKey.findUnique({
    where: { key: hashedKey },
    include: { user: true },
  });

  if (!apiKey) throw new Error("Invalid API key");
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) throw new Error("API key expired");

  // Update lastUsed
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsed: new Date() },
  });

  return apiKey.userId;
}

// --- MCP Server factory ---
// We create a new McpServer per request so each request is isolated
function createMcpServer(userId: string): McpServer {
  const server = new McpServer({
    name: "task-mcp",
    version: "1.0.0",
  });

  server.tool(
    "get_tasks",
    "Get all tasks for the authenticated user",
    {},
    async () => {
      const tasks = await prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      return {
        content: [{ type: "text", text: JSON.stringify(tasks, null, 2) }],
      };
    }
  );

  server.tool(
    "add_task",
    "Create a new task",
    {
      title: z.string().min(1).describe("Task title"),
      completed: z.boolean().optional().default(false).describe("Is the task completed?"),
      priority: z.enum(["low", "medium", "high"]).optional().default("medium").describe("Task priority"),
    },
    async ({ title, completed, priority }) => {
      const task = await prisma.task.create({
        data: { title, completed, priority, userId },
      });
      return {
        content: [{ type: "text", text: JSON.stringify(task, null, 2) }],
      };
    }
  );

  server.tool(
    "update_task",
    "Update an existing task",
    {
      id: z.string().describe("Task ID"),
      title: z.string().optional().describe("New title"),
      completed: z.boolean().optional().describe("Mark as completed or not"),
      priority: z.enum(["low", "medium", "high"]).optional().describe("New priority"),
    },
    async ({ id, title, completed, priority }) => {
      const task = await prisma.task.update({
        where: { id, userId },
        data: {
          ...(title !== undefined && { title }),
          ...(completed !== undefined && { completed }),
          ...(priority !== undefined && { priority }),
        },
      });
      return {
        content: [{ type: "text", text: JSON.stringify(task, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_task",
    "Delete a task",
    {
      id: z.string().describe("Task ID to delete"),
    },
    async ({ id }) => {
      await prisma.task.delete({
        where: { id, userId },
      });
      return {
        content: [{ type: "text", text: `Task ${id} deleted successfully` }],
      };
    }
  );

  return server;
}

// --- HTTP Server ---
const PORT = process.env.PORT || 3001;

const httpServer = http.createServer(async (req, res) => {
  if (req.url !== "/mcp") {
    res.writeHead(404).end("Not found");
    return;
  }

  try {
    const userId = await getUserFromApiKey(req.headers["authorization"]);

    const server = createMcpServer(userId);
    const transport = new StreamableHTTPServerTransport({});

    res.on("close", () => {
      transport.close();
      server.close();
    });

    await server.connect(transport as any);
    await transport.handleRequest(req, res);
  } catch (err: any) {
    if (!res.headersSent) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  }
});

httpServer.listen(PORT, () => {
  console.log(`MCP server running on http://localhost:${PORT}/mcp`);
});