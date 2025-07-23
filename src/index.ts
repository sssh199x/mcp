#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Import utilities
import { ANGULAR_PROJECT_PATH, ALLOWED_EXTENSIONS } from "./utils/file-operations.js";
import { createProjectOverviewTool } from "./tools/project-overview.js";
import { createReadFileTool } from "./tools/read-file.js";
import { createSearchCodebaseTool } from "./tools/search-codebase.js";
import { createAnalyzeArchitectureTool } from "./tools/analyze-architecture.js";

/**
 * Learning Notebook MCP Server
 * 
 * Provides deep context about the Angular 19 Learning Notebook project
 * including architecture, components, data models, and development patterns.
 */

// Create the MCP server instance
const server = new McpServer({
  name: "learning-notebook-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
    prompts: {}
  }
});

/**
 * Tool: Get Project Overview
 * Provides comprehensive information about the Learning Notebook project
 */
server.tool(
  "get_project_overview",
  "Get comprehensive overview of the Learning Notebook Angular project including architecture, tech stack, and current status",
  {},
  async () => {
    const tool = createProjectOverviewTool();
    return tool.handler();
  }
);

/**
 * Tool: Read File
 * Reads any file from the Learning Notebook project with full content and context
 */
server.tool(
  "read_file", 
  "Read any file from the Learning Notebook project with full content and contextual understanding",
  {
    filePath: z.string().describe("Relative path to the file from project root (e.g., 'src/app/app.component.ts')")
  },
  async ({ filePath }) => {
    const tool = createReadFileTool();
    return tool.handler({ filePath });
  }
);

/**
 * Tool: Search Codebase
 * Search through project files for specific patterns, text, or code snippets
 */
server.tool(
  "search_codebase",
  "Search through the Learning Notebook project files for specific patterns, text, or code snippets with context",
  {
    query: z.string().describe("Text or pattern to search for"),
    fileTypes: z.array(z.string()).optional().describe("File extensions to search (e.g., ['.ts', '.html']). If not specified, searches all allowed types"),
    directory: z.string().optional().describe("Specific directory to search within (relative to project root)")
  },
  async ({ query, fileTypes, directory }) => {
    const tool = createSearchCodebaseTool();
    return tool.handler({ query, fileTypes, directory });
  }
);

/**
 * Tool: Analyze Angular Architecture
 * Deep analysis of Angular project structure, components, services, and patterns
 */
server.tool(
  "analyze_angular_architecture",
  "Analyze the Angular project architecture including components, services, routing, data models, and development patterns",
  {
    focusArea: z.enum(['components', 'services', 'routing', 'models', 'patterns', 'all'])
      .describe("Which aspect of the architecture to analyze: components, services, routing, models, patterns, or all")
  },
  async ({ focusArea }) => {
    const tool = createAnalyzeArchitectureTool();
    return tool.handler({ focusArea });
  }
);

/**
 * Main execution
 */
async function main() {
  // Create stdio transport for communication with MCP host
  const transport = new StdioServerTransport();
  
  // Connect the server to the transport
  await server.connect(transport);
  
  // Log to stderr (stdout is used for MCP protocol communication)
  console.error("🚀 Learning Notebook MCP Server running on stdio");
  console.error("📚 Ready to provide deep context about your Angular project");
  console.error(`📁 Project path: ${ANGULAR_PROJECT_PATH}`);
  console.error(`📝 Allowed file types: ${ALLOWED_EXTENSIONS.join(', ')}`);
  console.error("");
  console.error("Available tools:");
  console.error("  • get_project_overview - Comprehensive project information");
  console.error("  • read_file - Read any project file with context");
  console.error("  • search_codebase - Search through project files");
  console.error("  • analyze_angular_architecture - Deep architecture analysis");
  console.error("");
  console.error("Server is ready to receive requests...");
}

// Handle errors and start the server
main().catch((error) => {
  console.error("❌ Fatal error in main():", error);
  process.exit(1);
});