import { resolve, extname } from 'path';
import type { ToolResponse, SearchQuery } from '../types/index.js';
import { 
  ANGULAR_PROJECT_PATH, 
  ALLOWED_EXTENSIONS,
  performSearch,
  countSearchableFiles,
  generateSearchAnalysis,
  generateRelatedSearches
} from '../utils/file-operations.js';

export function createSearchCodebaseTool() {
  return {
    name: "search_codebase",
    description: "Search through the Learning Notebook project files for specific patterns, text, or code snippets with context",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Text or pattern to search for"
        },
        fileTypes: {
          type: "array",
          items: { 
            type: "string" 
          },
          description: "File extensions to search (e.g., ['.ts', '.html']). If not specified, searches all allowed types",
          default: []
        },
        directory: {
          type: "string",
          description: "Specific directory to search within (relative to project root)",
          default: ""
        },
        includeContext: {
          type: "boolean",
          description: "Include enhanced context for code completion (future feature). Default: false",
          default: false
        }
      },
      required: ["query"],
      additionalProperties: false
    },
    handler: async ({ query, fileTypes, directory, includeContext = false }: { 
      query: string; 
      fileTypes?: string[]; 
      directory?: string;
      includeContext?: boolean;
    }): Promise<ToolResponse> => {
      try {
        const searchDir = directory ? resolve(ANGULAR_PROJECT_PATH, directory) : ANGULAR_PROJECT_PATH;
        const allowedTypes = fileTypes || ALLOWED_EXTENSIONS;
        
        // Validate search directory is within project
        if (!searchDir.startsWith(resolve(ANGULAR_PROJECT_PATH))) {
          throw new Error('Search directory is outside project directory');
        }

        const results = await performSearch(searchDir, query, allowedTypes);
        
        const totalFiles = await countSearchableFiles(searchDir, allowedTypes);
        const matchedFiles = [...new Set(results.map(r => r.file))].length;
        
        return {
          content: [
            {
              type: "text",
              text: `# 🔍 Search Results for "${query}"

## 📊 Search Summary
- **Query**: "${query}"
- **Directory**: ${directory || 'entire project'}
- **File Types**: ${allowedTypes.join(', ')}
- **Files Searched**: ${totalFiles}
- **Files with Matches**: ${matchedFiles}
- **Total Matches**: ${results.length}
- **Enhanced Context**: ${includeContext ? '🔧 Coming Soon!' : '❌ Disabled'}

${results.length === 0 ? `## ❌ No Results Found

No matches found for "${query}" in the specified location.

### 💡 Search Tips:
- Try using partial words or different spelling
- Check if you're searching in the right directory
- Use simpler search terms
- Consider searching different file types

### 📁 Common Search Locations:
- **Components**: \`src/app/shared/components/ui\`
- **Services**: \`src/app/core/services\`
- **Models**: \`src/app/core/models\`
- **Layout**: \`src/app/layout\`
- **Features**: \`src/app/features\`

### 🔍 Example Searches:
- Search for "signal": Find Angular signal usage
- Search for "component": Find component definitions
- Search for "interface": Find TypeScript interfaces
- Search for "bg-card": Find design token usage` : `## 📝 Search Results

${results.slice(0, 20).map((result, index) => `### ${index + 1}. ${result.file} ${getFileTypeEmoji(result.file)}
**Line ${result.line}**: \`${result.context.trim()}\`

\`\`\`${extname(result.file).substring(1) || 'text'}
${result.excerpt}
\`\`\`
---`).join('\n\n')}

${results.length > 20 ? `\n*Showing first 20 of ${results.length} results. Use more specific search terms to narrow results.*` : ''}`}

## 🎯 Search Analysis
${generateSearchAnalysis(results, query)}

## 🔄 Related Searches
Try these related searches:
${generateRelatedSearches(query, results).map(suggestion => `- "${suggestion}"`).join('\n')}

${includeContext ? `## 🔧 Enhanced Context
Enhanced context with imports, exports, and dependencies will be available soon! This will help Claude understand your codebase better for intelligent completion.` : ''}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Search Error**: ${error instanceof Error ? error.message : 'Unknown error'}

## 💡 Search Help
- Use simple text patterns
- Ensure directory exists within the project
- Check file type extensions are valid
- Try broader search terms

**Valid file types**: ${ALLOWED_EXTENSIONS.join(', ')}
**Project root**: \`${ANGULAR_PROJECT_PATH}\``
            }
          ]
        };
      }
    }
  };
}

/**
 * Get emoji for file type
 */
function getFileTypeEmoji(filePath: string): string {
  if (filePath.includes('.component.ts')) return '🧩';
  if (filePath.includes('.service.ts')) return '⚙️';
  if (filePath.includes('models/') || filePath.includes('.interface.ts')) return '📋';
  if (filePath.endsWith('.html')) return '🎨';
  if (filePath.endsWith('.scss') || filePath.endsWith('.css')) return '💅';
  if (filePath.endsWith('.ts')) return '📘';
  return '📄';
}