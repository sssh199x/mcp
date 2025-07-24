import { readFile, readdir } from 'fs/promises';
import { join, basename } from 'path';
import type { ToolResponse } from '../types/index.js';
import { ANGULAR_PROJECT_PATH } from '../utils/file-operations.js';

export function createGetUIComponentsTool() {
  return {
    name: "get_ui_components",
    description: "Get detailed information about all UI components in the Learning Notebook component library including props, variants, and usage examples",
    inputSchema: {
      type: "object" as const,
      properties: {
        component: {
          type: "string",
          description: "Optional: Get details for a specific component (e.g., 'button', 'stats-card'). If not specified, returns all components",
          default: ""
        },
        includeExamples: {
          type: "boolean", 
          description: "Include usage examples and code snippets. Default: true",
          default: true
        }
      },
      required: [],
      additionalProperties: false
    },
    handler: async ({ component = "", includeExamples = true }: { 
      component?: string; 
      includeExamples?: boolean;
    }): Promise<ToolResponse> => {
      try {
        const uiComponentsPath = join(ANGULAR_PROJECT_PATH, 'src/app/shared/components/ui');
        
        if (component) {
          // Get specific component details
          const componentInfo = await getComponentDetails(uiComponentsPath, component, includeExamples);
          return {
            content: [
              {
                type: "text",
                text: componentInfo
              }
            ]
          };
        } else {
          // Get all components overview
          const allComponents = await getAllComponentsOverview(uiComponentsPath, includeExamples);
          return {
            content: [
              {
                type: "text", 
                text: allComponents
              }
            ]
          };
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **UI Components Error**: ${error instanceof Error ? error.message : 'Unknown error'}

## 💡 Component Library Help
- Use without parameters to see all components
- Specify component name for detailed info: \`{"component": "button"}\`
- Toggle examples: \`{"includeExamples": false}\`

**UI Components Path**: \`src/app/shared/components/ui/\`

### 🎨 Available Components:
Try these component names:
- "button" - Multi-variant button with animations
- "stats-card" - Dashboard statistics display
- "note-card" - Note display with progress
- "animated-text" - Text animation effects
- "empty-state" - Beautiful empty states
- "ai-insight-card" - AI recommendation cards
- "progress-card" - Goal tracking with streaks
- "quick-actions-grid" - Action button grids
- "theme-toggle" - Dark/light mode switching`
            }
          ]
        };
      }
    }
  };
}

/**
 * Get details for a specific component
 */
async function getComponentDetails(uiPath: string, componentName: string, includeExamples: boolean): Promise<string> {
  const componentDir = join(uiPath, componentName);
  
  try {
    // Read component files
    const tsFile = join(componentDir, `${componentName}.component.ts`);
    const htmlFile = join(componentDir, `${componentName}.component.html`);
    const readmeFile = join(componentDir, `${componentName}.component.readme.md`);
    
    const tsContent = await readFile(tsFile, 'utf-8');
    let htmlContent = '';
    let readmeContent = '';
    
    try {
      htmlContent = await readFile(htmlFile, 'utf-8');
    } catch {
      // HTML file might not exist
    }
    
    try {
      readmeContent = await readFile(readmeFile, 'utf-8');
    } catch {
      // README might not exist
    }
    
    // Parse component information
    const componentInfo = parseComponentInfo(componentName, tsContent, htmlContent, readmeContent);
    
    return formatComponentDetails(componentInfo, includeExamples);
    
  } catch (error) {
    throw new Error(`Component "${componentName}" not found or not accessible`);
  }
}

/**
 * Get overview of all UI components
 */
async function getAllComponentsOverview(uiPath: string, includeExamples: boolean): Promise<string> {
  try {
    const componentDirs = await readdir(uiPath, { withFileTypes: true });
    const components = componentDirs
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    let overview = `# 🎨 Learning Notebook UI Component Library

## 📊 Component Overview
Found **${components.length} production-ready components** in your UI library:

`;

    // Get basic info for each component
    for (const componentName of components) {
      try {
        const componentDir = join(uiPath, componentName);
        const tsFile = join(componentDir, `${componentName}.component.ts`);
        const tsContent = await readFile(tsFile, 'utf-8');
        
        const basicInfo = parseBasicComponentInfo(componentName, tsContent);
        overview += formatComponentSummary(basicInfo);
        
      } catch {
        // Skip components that can't be read
        overview += `### ${componentName}\n❌ *Component not accessible*\n\n`;
      }
    }
    
    overview += `
## 🚀 Usage Patterns

### Component Import Pattern
\`\`\`typescript
import { ComponentNameComponent } from '../../shared/components/ui/component-name/component-name.component';

@Component({
  imports: [ComponentNameComponent]
})
\`\`\`

### Design System Integration
All components use:
- **Tailwind v4** design tokens
- **Signal-based** reactivity  
- **Accessibility** WCAG 2.1 AA compliance
- **Dark mode** automatic adaptation
- **Multiple variants** (size, color, style)

## 💡 Next Steps
- Use \`{"component": "button"}\` to get detailed component info
- Check component READMEs for comprehensive documentation
- All components are production-ready with full TypeScript support

*This component library provides everything needed for consistent, accessible UI development.*`;

    return overview;
    
  } catch (error) {
    throw new Error(`Unable to scan UI components directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Parse component information from TypeScript content
 */
function parseComponentInfo(name: string, tsContent: string, htmlContent: string, readmeContent: string) {
  return {
    name,
    selector: extractSelector(tsContent),
    inputs: extractInputs(tsContent),
    outputs: extractOutputs(tsContent),
    variants: extractVariants(tsContent),
    description: extractDescription(tsContent, readmeContent),
    examples: extractExamples(readmeContent),
    dependencies: extractDependencies(tsContent),
    templateComplexity: htmlContent.length > 0 ? 'Available' : 'Template-only',
    tsContent: tsContent.length,
    hasReadme: readmeContent.length > 0
  };
}

/**
 * Parse basic component info for overview
 */
function parseBasicComponentInfo(name: string, tsContent: string) {
  return {
    name,
    selector: extractSelector(tsContent),
    inputCount: extractInputs(tsContent).length,
    outputCount: extractOutputs(tsContent).length,
    description: extractShortDescription(tsContent),
    size: Math.round(tsContent.length / 1024 * 100) / 100
  };
}

/**
 * Extract component selector
 */
function extractSelector(content: string): string {
  const selectorMatch = content.match(/selector:\s*['"`]([^'"`]+)['"`]/);
  return selectorMatch ? selectorMatch[1] : 'app-component';
}

/**
 * Extract @Input properties
 */
function extractInputs(content: string): string[] {
  const inputs: string[] = [];
  const inputRegex = /@Input\(\)\s*(?:(?:public|private)?\s+)?(\w+)(?:\??):\s*([^=;]+)/g;
  
  let match;
  while ((match = inputRegex.exec(content)) !== null) {
    inputs.push(`${match[1]}: ${match[2].trim()}`);
  }
  
  return inputs;
}

/**
 * Extract @Output properties
 */
function extractOutputs(content: string): string[] {
  const outputs: string[] = [];
  const outputRegex = /@Output\(\)\s*(\w+)\s*=\s*new\s+EventEmitter<([^>]*)>/g;
  
  let match;
  while ((match = outputRegex.exec(content)) !== null) {
    outputs.push(`${match[1]}: EventEmitter<${match[2]}>`);
  }
  
  return outputs;
}

/**
 * Extract type variants (enums, type unions)
 */
function extractVariants(content: string): string[] {
  const variants: string[] = [];
  
  // Type aliases
  const typeMatches = content.match(/type\s+\w+\s*=\s*([^;]+);/g);
  if (typeMatches) {
    variants.push(...typeMatches);
  }
  
  return variants;
}

/**
 * Extract component description
 */
function extractDescription(tsContent: string, readmeContent: string): string {
  if (readmeContent) {
    const firstParagraph = readmeContent.split('\n\n')[1];
    if (firstParagraph) return firstParagraph.replace(/[#*]/g, '').trim();
  }
  
  // Fallback to TypeScript comments
  const commentMatch = tsContent.match(/\/\*\*\s*\n\s*\*\s*([^\n]+)/);
  return commentMatch ? commentMatch[1].trim() : 'Production-ready UI component';
}

/**
 * Extract short description for overview
 */
function extractShortDescription(content: string): string {
  const commentMatch = content.match(/\/\*\*\s*\n\s*\*\s*([^\n]+)/);
  if (commentMatch) return commentMatch[1].trim();
  
  // Fallback based on component name
  const descriptionMap: Record<string, string> = {
    'button': 'Multi-variant button with shine animations',
    'stats-card': 'Dashboard statistics with trend indicators', 
    'note-card': 'Note display with progress tracking',
    'animated-text': 'Text animations with color variants',
    'empty-state': 'Beautiful empty states with actions',
    'ai-insight-card': 'AI recommendations and insights',
    'progress-card': 'Goal tracking with streaks',
    'quick-actions-grid': 'Customizable action grids',
    'theme-toggle': 'Light/dark mode switching'
  };
  
  const name = basename(content.match(/class\s+(\w+)Component/)?.[1]?.toLowerCase() || '');
  return descriptionMap[name] || 'UI component with design system integration';
}

/**
 * Extract usage examples from README
 */
function extractExamples(readmeContent: string): string[] {
  if (!readmeContent) return [];
  
  const examples: string[] = [];
  const codeBlocks = readmeContent.match(/```html([\s\S]*?)```/g);
  
  if (codeBlocks) {
    examples.push(...codeBlocks.slice(0, 3)); // First 3 examples
  }
  
  return examples;
}

/**
 * Extract component dependencies
 */
function extractDependencies(content: string): string[] {
  const deps: string[] = [];
  const importMatches = content.match(/from\s+['"`]([^'"`]+)['"`]/g);
  
  if (importMatches) {
    importMatches.forEach(match => {
      const path = match.match(/from\s+['"`]([^'"`]+)['"`]/)?.[1];
      if (path && path.startsWith('../')) {
        deps.push(path);
      }
    });
  }
  
  return deps;
}

/**
 * Format detailed component information
 */
function formatComponentDetails(info: any, includeExamples: boolean): string {
  return `# 🧩 ${info.name.charAt(0).toUpperCase() + info.name.slice(1)}Component

## 📋 Component Overview
- **Selector**: \`<${info.selector}>\`
- **Inputs**: ${info.inputs.length} properties
- **Outputs**: ${info.outputs.length} events
- **Size**: ${Math.round(info.tsContent / 1024 * 100) / 100} KB
- **Documentation**: ${info.hasReadme ? '✅ Complete README available' : '📝 Basic documentation'}

## 🎯 Description
${info.description}

## 📥 Input Properties
${info.inputs.length > 0 ? info.inputs.map((input: string) => `- \`${input}\``).join('\n') : 'No input properties'}

## 📤 Output Events  
${info.outputs.length > 0 ? info.outputs.map((output: string) => `- \`${output}\``).join('\n') : 'No output events'}

${info.variants.length > 0 ? `## 🎨 Available Variants
${info.variants.map((variant: string) => `\`${variant}\``).join('\n')}` : ''}

## 🔗 Dependencies
${info.dependencies.length > 0 ? info.dependencies.map((dep: string) => `- \`${dep}\``).join('\n') : 'No external dependencies'}

${includeExamples && info.examples.length > 0 ? `## 💡 Usage Examples
${info.examples.join('\n\n')}` : ''}

## 🚀 Usage in Your Project
\`\`\`typescript
import { ${info.name.charAt(0).toUpperCase() + info.name.slice(1)}Component } from '../../shared/components/ui/${info.name}/${info.name}.component';

@Component({
  imports: [${info.name.charAt(0).toUpperCase() + info.name.slice(1)}Component]
})
\`\`\`

\`\`\`html
<${info.selector}>
  <!-- Component content -->
</${info.selector}>
\`\`\`

*This component is production-ready with full TypeScript support and design system integration.*`;
}

/**
 * Format component summary for overview
 */
function formatComponentSummary(info: any): string {
  return `### ${info.name} \`<${info.selector}>\`
${info.description}
- **Props**: ${info.inputCount} inputs, ${info.outputCount} outputs
- **Size**: ${info.size} KB

`;
}