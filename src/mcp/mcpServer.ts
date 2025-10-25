import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { placeOrder, sellStock } from "../services/kite.service";

const server = new McpServer({
  name: "Demo",
  version: "1.0.0",
});

const VarietyEnum = z.enum(["amo", "auction", "co", "iceberg", "regular"]);

server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
  content: [{ type: "text", text: String(a + b) }],
}));

server.tool(
  "buy-stock",
  { variety: VarietyEnum, tradingSymbol: z.string(), quantity: z.number() },
  async ({ variety, tradingSymbol, quantity }) => {
    await placeOrder(variety, tradingSymbol, quantity);
    return {
      content: [
        {
          type: "text",
          text: String(`Brought ${quantity} stocks of ${tradingSymbol}`),
        },
      ],
    };
  }
);

server.tool(
  "sell-stock",
  { variety: VarietyEnum, tradingSymbol: z.string(), quantity: z.number() },
  async ({ variety, tradingSymbol, quantity }) => {
    await sellStock(variety, tradingSymbol, quantity);
    return {
      content: [
        {
          type: "text",
          text: String(`Sold ${quantity} stocks of ${tradingSymbol}`),
        },
      ],
    };
  }
);

server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`,
      },
    ],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
