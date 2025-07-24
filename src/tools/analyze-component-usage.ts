import { readFile, readdir } from 'fs/promises';
import { join, relative, extname } from 'path';
import type { ToolResponse } from '../types/index.js';
import { ANGULAR_PROJECT_PATH, ALLOWED_EXTENSIONS } from '../utils/file-operations.js';

interface ComponentUsage {
  component: string;
  selector: string;
  usedIn: UsageLocation[];
  totalUsages: number;
  importPath: string;
  category: 'ui' | 'layout' | 'feature' | 'external';
}

interface UsageLocation {
  file: string;
  type: 'template' | 'typescript';
  line: number;
  context: string;
  usage: string;
}

export function createAnalyzeComponentUsageTool() {
  return {
    name: "analyze_component_usage",
    description: "Analyze how components are used throughout the Learning Notebook project, showing usage patterns, import relationships, and architectural insights",
    inputSchema: {
      type: "object" as const,
      properties: {
        component: {
          type: "string",
          description: "Optional: Analyze usage of a specific component (e.g., 'ButtonComponent', 'app-button'). If not specified, analyzes all components",
          default: ""
        },
        includeContext: {
          type: "boolean",
          description: "Include code context around each usage. Default: true",
          default: true
        },
        groupBy: {
          type: "string",
          enum: ["component", "file", "category"],
          description: "Group results by component, file, or category. Default: 'component'",
          default: "component"
        },
        showUnused: {
          type: "boolean",
          description: "Include components that are not used anywhere. Default: false",
          default: false
        }
      },
      required: [],
      additionalProperties: false
    },
    handler: async ({ component = "", includeContext = true, groupBy = "component", showUnused = false }: {
      component?: string;
      includeContext?: boolean;
      groupBy?: string;
      showUnused?: boolean;
    }): Promise<ToolResponse> => {
      try {
        const usageAnalysis = await analyzeComponentUsage(ANGULAR_PROJECT_PATH, component, includeContext);
        const formattedOutput = formatUsageAnalysis(usageAnalysis, groupBy, showUnused, includeContext);
        
        return {
          content: [
            {
              type: "text",
              text: formattedOutput
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Component Usage Analysis Error**: ${error instanceof Error ? error.message : 'Unknown error'}

## 💡 Usage Analysis Help
- Use without parameters to see all component usage
- Specify component: \`{"component": "ButtonComponent"}\`
- Group by file: \`{"groupBy": "file"}\`
- Show unused components: \`{"showUnused": true}\`

**Project Path**: \`${ANGULAR_PROJECT_PATH}\`

### 🧩 Example Queries:
\`\`\`json
{"component": "app-button", "includeContext": true}
\`\`\`

\`\`\`json
{"groupBy": "category", "showUnused": true}
\`\`\`

\`\`\`json
{"groupBy": "file"}
\`\`\`

### 🎯 What This Tool Analyzes:
- Component import statements in TypeScript files
- Component usage in HTML templates  
- Usage patterns and frequency
- Architectural relationships
- Unused components identification`
            }
          ]
        };
      }
    }
  };
}

/**
 * Analyze component usage throughout the project
 */
async function analyzeComponentUsage(projectPath: string, targetComponent: string, includeContext: boolean): Promise<ComponentUsage[]> {
  const componentUsages: Map<string, ComponentUsage> = new Map();
  
  // First, discover all components
  await discoverComponents(projectPath, componentUsages);
  
  // Then, scan for usage in all files
  await scanForUsages(projectPath, componentUsages, includeContext);
  
  // Filter by target component if specified
  const results = Array.from(componentUsages.values());
  if (targetComponent) {
    return results.filter(usage => 
      usage.component.toLowerCase().includes(targetComponent.toLowerCase()) ||
      usage.selector.toLowerCase().includes(targetComponent.toLowerCase())
    );
  }
  
  return results.sort((a, b) => b.totalUsages - a.totalUsages);
}

/**
 * Discover all components in the project
 */
async function discoverComponents(projectPath: string, componentUsages: Map<string, ComponentUsage>): Promise<void> {
  const srcPath = join(projectPath, 'src');
  
  await scanDirectory(srcPath, async (filePath: string) => {
    if (filePath.endsWith('.component.ts')) {
      try {
        const content = await readFile(filePath, 'utf-8');
        const componentName = extractComponentName(content, filePath);
        const selector = extractSelector(content);
        
        if (componentName && selector) {
          const relativePath = relative(projectPath, filePath);
          const category = determineComponentCategory(relativePath);
          
          componentUsages.set(componentName, {
            component: componentName,
            selector,
            usedIn: [],
            totalUsages: 0,
            importPath: relativePath,
            category
          });
        }
      } catch {
        // Skip files that can't be read
      }
    }
  });
}

/**
 * Scan for component usages in all files
 */
async function scanForUsages(projectPath: string, componentUsages: Map<string, ComponentUsage>, includeContext: boolean): Promise<void> {
  const srcPath = join(projectPath, 'src');
  
  await scanDirectory(srcPath, async (filePath: string) => {
    const ext = extname(filePath);
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      try {
        const content = await readFile(filePath, 'utf-8');
        const relativePath = relative(projectPath, filePath);
        
        if (ext === '.ts') {
          await scanTypeScriptFile(content, relativePath, componentUsages, includeContext);
        } else if (ext === '.html') {
          await scanTemplateFile(content, relativePath, componentUsages, includeContext);
        }
      } catch {
        // Skip files that can't be read
      }
    }
  });
}

/**
 * Scan TypeScript file for component imports and usage
 */
async function scanTypeScriptFile(content: string, filePath: string, componentUsages: Map<string, ComponentUsage>, includeContext: boolean): Promise<void> {
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Look for import statements
    const importMatch = line.match(/import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/);
    if (importMatch) {
      const imports = importMatch[1].split(',').map(imp => imp.trim());
      
      imports.forEach(importName => {
        if (componentUsages.has(importName)) {
          const usage = componentUsages.get(importName)!;
          usage.usedIn.push({
            file: filePath,
            type: 'typescript',
            line: index + 1,
            context: includeContext ? getContextLines(lines, index, 2) : '',
            usage: `Import: ${line.trim()}`
          });
          usage.totalUsages++;
        }
      });
    }
    
    // Look for component usage in imports array
    const importsArrayMatch = line.match(/imports:\s*\[([^\]]+)\]/);
    if (importsArrayMatch) {
      const componentRefs = importsArrayMatch[1].split(',').map(ref => ref.trim());
      
      componentRefs.forEach(ref => {
        if (componentUsages.has(ref)) {
          const usage = componentUsages.get(ref)!;
          usage.usedIn.push({
            file: filePath,
            type: 'typescript',
            line: index + 1,
            context: includeContext ? getContextLines(lines, index, 2) : '',
            usage: `Component Import: ${ref}`
          });
          usage.totalUsages++;
        }
      });
    }
  });
}

/**
 * Scan HTML template file for component usage
 */
async function scanTemplateFile(content: string, filePath: string, componentUsages: Map<string, ComponentUsage>, includeContext: boolean): Promise<void> {
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Look for component selectors in templates
    componentUsages.forEach((usage, componentName) => {
      const selectorRegex = new RegExp(`<${usage.selector}[\\s>]`, 'g');
      
      if (selectorRegex.test(line)) {
        usage.usedIn.push({
          file: filePath,
          type: 'template',
          line: index + 1,
          context: includeContext ? getContextLines(lines, index, 1) : '',
          usage: `Template: <${usage.selector}>`
        });
        usage.totalUsages++;
      }
    });
  });
}

/**
 * Recursively scan directory
 */
async function scanDirectory(dirPath: string, fileHandler: (filePath: string) => Promise<void>): Promise<void> {
  try {
    const items = await readdir(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = join(dirPath, item.name);
      
      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules' && item.name !== 'dist') {
        await scanDirectory(fullPath, fileHandler);
      } else if (item.isFile()) {
        await fileHandler(fullPath);
      }
    }
  } catch {
    // Skip directories that can't be read
  }
}

/**
 * Extract component name from TypeScript content
 */
function extractComponentName(content: string, filePath: string): string | null {
  const classMatch = content.match(/export\s+class\s+(\w+Component)/);
  return classMatch ? classMatch[1] : null;
}

/**
 * Extract component selector
 */
function extractSelector(content: string): string {
  const selectorMatch = content.match(/selector:\s*['"`]([^'"`]+)['"`]/);
  return selectorMatch ? selectorMatch[1] : 'unknown-selector';
}

/**
 * Determine component category based on file path
 */
function determineComponentCategory(filePath: string): 'ui' | 'layout' | 'feature' | 'external' {
  if (filePath.includes('shared/components/ui')) return 'ui';
  if (filePath.includes('layout/')) return 'layout';
  if (filePath.includes('features/')) return 'feature';
  return 'external';
}

/**
 * Get context lines around a specific line
 */
function getContextLines(lines: string[], targetIndex: number, radius: number): string {
  const start = Math.max(0, targetIndex - radius);
  const end = Math.min(lines.length, targetIndex + radius + 1);
  
  return lines.slice(start, end)
    .map((line, index) => {
      const lineNum = start + index + 1;
      const marker = (start + index === targetIndex) ? '→ ' : '  ';
      return `${marker}${lineNum}: ${line}`;
    })
    .join('\n');
}

/**
 * Format usage analysis results
 */
function formatUsageAnalysis(usages: ComponentUsage[], groupBy: string, showUnused: boolean, includeContext: boolean): string {
  const totalComponents = usages.length;
  const usedComponents = usages.filter(u => u.totalUsages > 0);
  const unusedComponents = usages.filter(u => u.totalUsages === 0);
  
  let output = `# 🔍 Component Usage Analysis

## 📊 Usage Overview
- **Total Components**: ${totalComponents}
- **Used Components**: ${usedComponents.length}
- **Unused Components**: ${unusedComponents.length}
- **Total Usages**: ${usages.reduce((sum, u) => sum + u.totalUsages, 0)}

`;

  if (groupBy === "component") {
    output += formatByComponent(usages, showUnused, includeContext);
  } else if (groupBy === "category") {
    output += formatByCategory(usages, showUnused, includeContext);
  } else if (groupBy === "file") {
    output += formatByFile(usages, showUnused, includeContext);
  }

  output += generateArchitecturalInsights(usages);
  
  return output;
}

/**
 * Format results grouped by component
 */
function formatByComponent(usages: ComponentUsage[], showUnused: boolean, includeContext: boolean): string {
  let output = `## 🧩 Component Usage Details\n\n`;
  
  const componentsToShow = showUnused ? usages : usages.filter(u => u.totalUsages > 0);
  
  componentsToShow.forEach((usage, index) => {
    const categoryEmoji = getCategoryEmoji(usage.category);
    
    output += `### ${index + 1}. ${usage.component} ${categoryEmoji}
- **Selector**: \`<${usage.selector}>\`
- **Category**: ${usage.category}
- **Import Path**: \`${usage.importPath}\`
- **Total Usages**: ${usage.totalUsages}
- **Used In**: ${usage.usedIn.length} files

`;

    if (usage.usedIn.length > 0) {
      output += `#### Usage Locations:\n`;
      usage.usedIn.slice(0, 5).forEach(location => {
        output += `- **${location.file}** (line ${location.line}) - ${location.usage}\n`;
        if (includeContext && location.context) {
          output += `\`\`\`${location.type === 'typescript' ? 'typescript' : 'html'}\n${location.context}\n\`\`\`\n`;
        }
      });
      
      if (usage.usedIn.length > 5) {
        output += `*... and ${usage.usedIn.length - 5} more locations*\n`;
      }
    } else {
      output += `❌ **Unused Component** - This component is not used anywhere in the project.\n`;
    }
    
    output += `\n---\n\n`;
  });
  
  return output;
}

/**
 * Format results grouped by category
 */
function formatByCategory(usages: ComponentUsage[], showUnused: boolean, includeContext: boolean): string {
  const categories = ['ui', 'layout', 'feature', 'external'] as const;
  let output = `## 📂 Usage by Category\n\n`;
  
  categories.forEach(category => {
    const categoryComponents = usages.filter(u => u.category === category);
    if (categoryComponents.length === 0) return;
    
    const usedInCategory = categoryComponents.filter(u => u.totalUsages > 0).length;
    const totalUsages = categoryComponents.reduce((sum, u) => sum + u.totalUsages, 0);
    
    output += `### ${getCategoryEmoji(category)} ${category.toUpperCase()} Components
- **Components**: ${categoryComponents.length}
- **Used**: ${usedInCategory}/${categoryComponents.length}
- **Total Usages**: ${totalUsages}

`;

    categoryComponents.forEach(comp => {
      const status = comp.totalUsages > 0 ? `✅ ${comp.totalUsages} usages` : '❌ Unused';
      output += `- **${comp.component}** (\`<${comp.selector}>\`) - ${status}\n`;
    });
    
    output += `\n`;
  });
  
  return output;
}

/**
 * Format results grouped by file
 */
function formatByFile(usages: ComponentUsage[], showUnused: boolean, includeContext: boolean): string {
  const fileUsages = new Map<string, { component: string; usage: string; line: number }[]>();
  
  usages.forEach(usage => {
    usage.usedIn.forEach(location => {
      if (!fileUsages.has(location.file)) {
        fileUsages.set(location.file, []);
      }
      fileUsages.get(location.file)!.push({
        component: usage.component,
        usage: location.usage,
        line: location.line
      });
    });
  });
  
  let output = `## 📄 Usage by File\n\n`;
  
  Array.from(fileUsages.entries())
    .sort(([, a], [, b]) => b.length - a.length)
    .forEach(([file, fileUsageList]) => {
      output += `### ${file}
**Components Used**: ${fileUsageList.length}

`;
      
      fileUsageList.forEach(usage => {
        output += `- **${usage.component}** (line ${usage.line}) - ${usage.usage}\n`;
      });
      
      output += `\n`;
    });
  
  return output;
}

/**
 * Generate architectural insights
 */
function generateArchitecturalInsights(usages: ComponentUsage[]): string {
  const totalUsages = usages.reduce((sum, u) => sum + u.totalUsages, 0);
  const mostUsed = usages.filter(u => u.totalUsages > 0).slice(0, 3);
  const unused = usages.filter(u => u.totalUsages === 0);
  
  return `## 🎯 Architectural Insights

### 📈 Most Used Components
${mostUsed.map((comp, index) => `${index + 1}. **${comp.component}** - ${comp.totalUsages} usages (${comp.category})`).join('\n')}

### 🏗️ Component Distribution
- **UI Components**: ${usages.filter(u => u.category === 'ui').length}
- **Layout Components**: ${usages.filter(u => u.category === 'layout').length}
- **Feature Components**: ${usages.filter(u => u.category === 'feature').length}
- **External Components**: ${usages.filter(u => u.category === 'external').length}

### 💡 Recommendations
${unused.length > 0 ? `- **Remove unused components**: ${unused.length} components are not used and could be removed` : '- **No unused components** - Great code hygiene!'}
- **Component reuse**: ${Math.round((totalUsages / usages.length) * 100) / 100} average usages per component
- **Architecture health**: ${unused.length === 0 ? 'Excellent' : unused.length < 3 ? 'Good' : 'Needs attention'} - based on component usage patterns

### 🚀 Usage Patterns
This analysis helps identify:
- Which components are core to your application
- Opportunities for component consolidation
- Unused code that can be removed
- Architectural dependencies and relationships

*Use this information to guide refactoring decisions and maintain a clean component architecture.*`;
}

/**
 * Get emoji for component category
 */
function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    ui: '🎨',
    layout: '🏗️',
    feature: '⚡',
    external: '📦'
  };
  return emojiMap[category] || '🧩';
}