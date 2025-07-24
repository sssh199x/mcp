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
import { createGetUIComponentsTool } from "./tools/get-ui-components.js";
import { createGetDesignTokensTool } from "./tools/get-design-tokens.js";
import { createAnalyzeComponentUsageTool } from "./tools/analyze-component-usage.js";
import { createGenerateComponentBoilerplateTool } from "./tools/generate-component-boilerplate.js";

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
 * Tool: Get UI Components
 */
server.tool(
  "get_ui_components",
  "Get detailed information about all UI components in the Learning Notebook component library including props, variants, and usage examples",
  {
    component: z.string().optional().describe("Optional: Get details for a specific component (e.g., 'button', 'stats-card'). If not specified, returns all components"),
    includeExamples: z.boolean().optional().describe("Include usage examples and code snippets. Default: true")
  },
  async ({ component, includeExamples }) => {
    const tool = createGetUIComponentsTool();
    return tool.handler({ component, includeExamples });
  }
);

/**
 * Tool: Get Design Tokens
 */
server.tool(
  "get_design_tokens",
  "Get comprehensive information about the Tailwind v4 design system including colors, typography, spacing, and CSS custom properties used in the Learning Notebook project",
  {
    category: z.enum(["all", "colors", "typography", "spacing", "shadows", "transitions", "components"]).optional().describe("Filter design tokens by category. Default: 'all'"),
    includeExamples: z.boolean().optional().describe("Include usage examples for each token. Default: true"),
    format: z.enum(["detailed", "reference", "css"]).optional().describe("Output format: detailed (full docs), reference (quick lookup), css (raw values). Default: 'detailed'")
  },
  async ({ category, includeExamples, format }) => {
    const tool = createGetDesignTokensTool();
    return tool.handler({ category, includeExamples, format });
  }
);

/**
 * Tool: Analyze Component Usage
 */
server.tool(
  "analyze_component_usage",
  "Analyze how components are used throughout the Learning Notebook project, showing usage patterns, import relationships, and architectural insights",
  {
    component: z.string().optional().describe("Optional: Analyze usage of a specific component (e.g., 'ButtonComponent', 'app-button'). If not specified, analyzes all components"),
    includeContext: z.boolean().optional().describe("Include code context around each usage. Default: true"),
    groupBy: z.enum(["component", "file", "category"]).optional().describe("Group results by component, file, or category. Default: 'component'"),
    showUnused: z.boolean().optional().describe("Include components that are not used anywhere. Default: false")
  },
  async ({ component, includeContext, groupBy, showUnused }) => {
    const tool = createAnalyzeComponentUsageTool();
    return tool.handler({ component, includeContext, groupBy, showUnused });
  }
);

/**
 * Tool: Generate Component Boilerplate
 */
server.tool(
  "generate_component_boilerplate",
  "Generate complete Angular component boilerplate following Learning Notebook patterns and conventions, including TypeScript, HTML, SCSS, README, and test files",
  {
    name: z.string().describe("Component name in kebab-case (e.g., 'task-card', 'user-profile'). Will be converted to proper naming conventions"),
    type: z.enum(["ui", "layout", "feature", "page"]).optional().describe("Component type: ui (reusable UI component), layout (app structure), feature (business logic), page (route component)"),
    features: z.array(z.string()).optional().describe("Component features to include: ['inputs', 'outputs', 'variants', 'loading', 'accessibility', 'animations', 'docs']"),
    includeReadme: z.boolean().optional().describe("Generate comprehensive README documentation. Default: true"),
    includeTests: z.boolean().optional().describe("Generate test file boilerplate. Default: false")
  },
  async ({ name, type, features, includeReadme, includeTests }) => {
    const tool = createGenerateComponentBoilerplateTool();
    return tool.handler({ name, type, features, includeReadme, includeTests });
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