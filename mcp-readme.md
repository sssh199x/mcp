# Learning Notebook MCP Server

A comprehensive Model Context Protocol (MCP) server that provides deep contextual understanding of your Angular 19 Learning Notebook project. This server enables Claude to analyze, understand, and help with your entire codebase including components, services, architecture, design system, and more.

## 🚀 Overview

The Learning Notebook MCP Server gives Claude AI direct access to your Angular project with intelligent analysis capabilities. It's designed specifically for the Learning Notebook application but follows patterns that can be adapted for any Angular project.

### Key Features
- **Real-time Project Analysis** - Always current with your latest changes
- **Comprehensive File Support** - TypeScript, HTML, SCSS, CSS, JSON, Markdown
- **Angular-Aware** - Understands components, services, routing, and architecture
- **Design System Integration** - Full Tailwind v4 and design token analysis
- **Code Intelligence** - Advanced search, usage analysis, and refactoring insights
- **Production Ready** - Built for the Learning Notebook production environment

## 📋 Table of Contents

- [Installation & Setup](#installation--setup)
- [Available Tools](#available-tools)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Advanced Usage](#advanced-usage)
- [Contributing](#contributing)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Angular project (specifically designed for Learning Notebook)
- Claude Desktop application

### 1. Clone and Build
```bash
git clone <your-mcp-server-repo>
cd learning-notebook-mcp-server
npm install
npm run build
```

### 2. Configure Claude Desktop
Create or edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "learning-notebook": {
      "command": "/opt/homebrew/bin/node",
      "args": ["/Users/your-username/path/to/learning-notebook-mcp-server/build/index.js"],
      "env": {}
    }
  }
}
```

### 3. Update Project Path
Edit `src/utils/file-operations.ts` to point to your Angular project:

```typescript
export const ANGULAR_PROJECT_PATH = resolve("/Users/your-username/path/to/learning-notebook");
```

### 4. Restart Claude Desktop
Completely quit and restart Claude Desktop to load the MCP server.

## 🔧 Available Tools

### 1. Project Overview (`get_project_overview`)

**Purpose**: Get comprehensive information about the entire Learning Notebook project.

**Usage**:
```
"Give me an overview of my Learning Notebook project"
"What's the current status of my Angular application?"
```

**Provides**:
- Tech stack details (Angular 19, Tailwind v4, TypeScript 5.7.2)
- Architecture overview and design philosophy
- Development status and completion metrics
- Component library summary
- Project structure and key directories

### 2. File Reader (`read_file`)

**Purpose**: Read any file from the project with contextual understanding.

**Parameters**:
- `filePath` (required): Relative path from project root

**Usage**:
```
"Read the main app component file"
"Show me the package.json configuration"
"Read the dashboard component TypeScript file"
```

**Example**:
```
"Read src/app/shared/components/ui/button/button.component.ts"
```

**Features**:
- Syntax highlighting based on file type
- File size and metadata
- Project context information
- Security validation (files must be within project)

### 3. Codebase Search (`search_codebase`)

**Purpose**: Search through project files for patterns, text, or code snippets.

**Parameters**:
- `query` (required): Text or pattern to search for
- `fileTypes` (optional): Array of file extensions (e.g., ['.ts', '.html'])
- `directory` (optional): Specific directory to search within

**Usage**:
```
"Search for 'signal' in my codebase"
"Find all uses of 'BehaviorSubject' in TypeScript files"
"Search for 'bg-card' in my templates"
```

**Advanced Examples**:
```
"Search for 'component' in the shared directory"
"Find 'interface' in .ts files only"
"Search for '@Input' across all TypeScript files"
```

**Features**:
- Context-aware results with line numbers
- Code excerpts with surrounding lines
- File type filtering
- Directory-specific searches
- Related search suggestions
- Pattern analysis and insights

### 4. Angular Architecture Analysis (`analyze_angular_architecture`)

**Purpose**: Deep analysis of Angular project structure, patterns, and architecture.

**Parameters**:
- `focusArea`: 'components' | 'services' | 'routing' | 'models' | 'patterns' | 'all'

**Usage**:
```
"Analyze my Angular architecture"
"Show me details about my components"
"Analyze my services and their patterns"
"Give me an overview of my data models"
```

**Focus Areas**:

#### Components Analysis
- Component distribution (UI, Layout, Feature, Root)
- Modern Angular features usage (Standalone, Signals, inject())
- Component quality metrics
- Template complexity analysis

#### Services Analysis
- Service categories (Core, Data, Utility)
- Dependency injection patterns
- Reactive programming usage
- Service architecture insights

#### Routing Analysis
- Route structure and configuration
- Lazy loading implementation
- Navigation patterns
- SEO and performance optimizations

#### Data Models Analysis
- TypeScript interface coverage
- Model relationships and structure
- Type system features
- Data architecture patterns

#### Patterns Analysis
- Modern Angular patterns (Signals, Standalone, inject())
- Design system integration
- Accessibility implementations
- Performance optimizations

### 5. UI Components Library (`get_ui_components`)

**Purpose**: Detailed information about the UI component library.

**Parameters**:
- `component` (optional): Specific component name (e.g., 'button', 'stats-card')
- `includeExamples` (optional): Include usage examples (default: true)

**Usage**:
```
"Show me all my UI components"
"Give me details about the button component"
"What UI components do I have available?"
```

**Component Information**:
- Component props (inputs/outputs)
- Available variants and sizes
- Usage examples and code snippets
- Dependencies and relationships
- Documentation status

**Available Components**:
- AnimatedText - Text animations with color variants
- Button - Multi-variant buttons with shine animations
- StatsCard - Dashboard statistics with trends
- NoteCard - Note display with progress tracking
- EmptyState - Beautiful empty states with actions
- AIInsightCard - AI recommendations display
- ProgressCard - Goal tracking with streaks
- QuickActionsGrid - Customizable action grids
- ThemeToggle - Light/dark mode switching

### 6. Design System Tokens (`get_design_tokens`)

**Purpose**: Comprehensive Tailwind v4 design system information.

**Parameters**:
- `category` (optional): 'all' | 'colors' | 'typography' | 'spacing' | 'shadows' | 'transitions' | 'components'
- `includeExamples` (optional): Include usage examples (default: true)
- `format` (optional): 'detailed' | 'reference' | 'css' (default: 'detailed')

**Usage**:
```
"Show me all design tokens"
"What colors are available in my design system?"
"Give me typography information"
"Show me spacing tokens in CSS format"
```

**Categories**:

#### Colors
- Brand colors (primary, secondary, accent)
- Semantic colors (success, warning, danger, info)
- Theme colors (dynamic light/dark)
- Syntax highlighting colors

#### Typography
- Font families (Inter, JetBrains Mono)
- Font sizes and scales
- Line heights and letter spacing
- Usage patterns

#### Spacing
- Spacing scale (0px to 2rem)
- Common patterns
- Component spacing guidelines

#### Shadows
- Elevation levels (sm to 2xl)
- Usage patterns for different components
- Depth and layering guidelines

### 7. Component Usage Analysis (`analyze_component_usage`)

**Purpose**: Analyze how components are used throughout the project.

**Parameters**:
- `component` (optional): Specific component to analyze
- `includeContext` (optional): Include code context (default: true)
- `groupBy` (optional): 'component' | 'file' | 'category' (default: 'component')
- `showUnused` (optional): Include unused components (default: false)

**Usage**:
```
"Analyze how my components are being used"
"Show me unused components in my project"
"How is the button component being used?"
"Group component usage by category"
```

**Analysis Features**:
- Usage frequency and patterns
- Import relationships
- Template usage detection
- Unused component identification
- Architectural insights and recommendations

### 8. Component Boilerplate Generator (`generate_component_boilerplate`)

**Purpose**: Generate complete Angular component boilerplate following project patterns.

**Parameters**:
- `name` (required): Component name in kebab-case
- `type` (optional): 'ui' | 'layout' | 'feature' | 'page' (default: 'ui')
- `features` (optional): Array of features to include
- `includeReadme` (optional): Generate README documentation (default: true)
- `includeTests` (optional): Generate test files (default: false)

**Usage**:
```
"Generate a new UI component called 'task-card'"
"Create a feature component named 'user-profile' with animations"
"Generate a page component for 'settings' with all features"
```

**Generated Files**:
- TypeScript component file
- HTML template
- SCSS styles
- README documentation
- Test file (optional)

**Available Features**:
- `inputs` - @Input properties with types
- `outputs` - @Output events with EventEmitter
- `variants` - Size and color variant support
- `loading` - Loading states and skeleton UI
- `accessibility` - ARIA labels and keyboard navigation
- `animations` - Transition and hover effects
- `docs` - Comprehensive documentation

## 💡 Usage Examples

### Project Analysis and Understanding

```bash
# Get overall project status
"Give me a comprehensive overview of my Learning Notebook project"

# Understand architecture
"Analyze my Angular architecture and show me the key patterns"

# Review component library
"Show me all my UI components and their current usage"
```

### Code Search and Investigation

```bash
# Find specific patterns
"Search for all signal usage in my components"

# Investigate styling
"Search for 'bg-card' usage across my templates"

# Find architectural patterns
"Search for 'inject(' in my services"
```

### Refactoring and Optimization

```bash
# Identify unused code
"Show me any unused components I can clean up"

# Find inconsistencies
"Search for components not using the design system properly"

# Analyze usage patterns
"Analyze component usage and suggest consolidation opportunities"
```

### Component Development

```bash
# Generate new components
"Create a new UI component called 'notification-card' with variants and accessibility"

# Understand existing components
"Show me detailed information about the button component"

# Get design guidance
"What design tokens should I use for a new card component?"
```

### Design System Work

```bash
# Review design tokens
"Show me all available colors in the design system"

# Check consistency
"Find places where I'm using custom CSS instead of design tokens"

# Get implementation guidance
"What typography tokens should I use for headings?"
```

## ⚙️ Configuration

### Environment Variables

You can set these in the MCP server configuration:

```json
{
  "mcpServers": {
    "learning-notebook": {
      "command": "/opt/homebrew/bin/node",
      "args": ["/path/to/build/index.js"],
      "env": {
        "NODE_ENV": "production",
        "DEBUG": "false"
      }
    }
  }
}
```

### Project Path Configuration

Update the Angular project path in `src/utils/file-operations.ts`:

```typescript
// For absolute path
export const ANGULAR_PROJECT_PATH = resolve("/Users/username/projects/learning-notebook");

// For relative path (from MCP server directory)
export const ANGULAR_PROJECT_PATH = resolve(process.cwd(), "../learning-notebook");
```

### File Type Support

Supported file extensions (configured in `src/utils/file-operations.ts`):

```typescript
export const ALLOWED_EXTENSIONS = ['.ts', '.html', '.scss', '.css', '.json', '.md', '.js'];
```

## 🐛 Troubleshooting

### Common Issues

#### MCP Server Not Loading
```bash
# Check Claude Desktop config location
ls -la ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Verify JSON syntax
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | python3 -m json.tool

# Check file ownership
sudo chown $USER:staff ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### Wrong Project Path
```bash
# Verify your Angular project location
find ~ -name "learning-notebook" -type d 2>/dev/null

# Update the path in file-operations.ts and rebuild
npm run build
```

#### Node.js Path Issues
```bash
# Find your Node.js location
which node

# Update Claude config with correct path
# Use full path like "/opt/homebrew/bin/node"
```

### Testing Tools

#### Test MCP Server Directly
```bash
# Test server startup
node build/index.js

# Test with MCP Inspector
npx @modelcontextprotocol/inspector build/index.js
```

#### Debug Individual Tools
```bash
# Test project overview
echo '{"tool": "get_project_overview"}' | node build/index.js

# Test file reading
echo '{"tool": "read_file", "arguments": {"filePath": "package.json"}}' | node build/index.js
```

### Log Analysis

Check system logs for Claude Desktop errors:

```bash
log show --predicate 'process == "Claude"' --info --last 5m
```

## 🚀 Advanced Usage

### Custom Queries

#### Architecture Deep Dives
```bash
"Analyze my services and show me opportunities to implement more reactive patterns"

"Review my component architecture and suggest better separation of concerns"

"Show me how my routing is structured and suggest improvements for lazy loading"
```

#### Code Quality Analysis
```bash
"Search for components that don't follow our TypeScript strict mode patterns"

"Find all places where I'm not using Angular signals effectively"

"Identify components that could benefit from standalone architecture"
```

#### Design System Optimization
```bash
"Find all custom CSS that could be replaced with design tokens"

"Show me components that aren't following our design system consistently"

"Analyze my SCSS files for optimization opportunities"
```

### Workflow Integration

#### Development Workflow
1. **Planning**: "Analyze my current architecture before adding new features"
2. **Implementation**: "Generate boilerplate for new components following our patterns"
3. **Review**: "Search for potential issues in my recent changes"
4. **Refactoring**: "Identify cleanup opportunities in my codebase"

#### Code Review Workflow
1. **Component Analysis**: "Review this component's usage across the application"
2. **Pattern Verification**: "Check if this follows our established patterns"
3. **Optimization**: "Suggest improvements for this implementation"

## 🤝 Contributing

### Adding New Tools

1. **Create Tool File**: Add new tool in `src/tools/`
2. **Register Tool**: Add to `src/index.ts`
3. **Update Types**: Add interfaces to `src/types/index.ts`
4. **Add Utilities**: Helper functions in `src/utils/`
5. **Test**: Use MCP Inspector to verify
6. **Document**: Update this README

### Tool Development Pattern

```typescript
// src/tools/your-new-tool.ts
export function createYourNewTool() {
  return {
    name: "your_new_tool",
    description: "Description of what your tool does",
    inputSchema: {
      type: "object" as const,
      properties: {
        // Define parameters
      },
      required: ["required-params"]
    },
    handler: async (params: YourParams): Promise<ToolResponse> => {
      // Implementation
    }
  };
}
```

### Testing New Tools

```bash
# Rebuild after changes
npm run build

# Test with inspector
npx @modelcontextprotocol/inspector build/index.js

# Test integration with Claude Desktop
```

## 📚 Resources

### MCP Protocol
- [MCP Documentation](https://modelcontextprotocol.io/)
- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)

### Angular Resources
- [Angular Documentation](https://angular.io/docs)
- [Angular Signals](https://angular.io/guide/signals)
- [Angular Standalone Components](https://angular.io/guide/standalone-components)

### Design System
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [CSS-First API](https://tailwindcss.com/docs/css-first)

## 📄 License

MIT License - See LICENSE file for details.

## 🆕 Version History

### v1.0.0 (Current)
- Complete Angular 19 project analysis
- 8 comprehensive tools
- Real-time file system scanning
- Tailwind v4 design system integration
- Component usage analysis
- Boilerplate generation
- Full TypeScript support

---

**Built for the Learning Notebook project with ❤️**

*This MCP server provides Claude with deep understanding of your Angular application, enabling intelligent assistance with development, refactoring, and architectural decisions.*