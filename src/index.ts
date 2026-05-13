import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { server } from "./mcp.ts";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

async function main() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    console.error('Encrypt MCP Server running on stdio')
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});