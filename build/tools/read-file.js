import { readFile, stat } from 'fs/promises';
import { relative, extname } from 'path';
import { validateFilePath, ANGULAR_PROJECT_PATH, ALLOWED_EXTENSIONS } from '../utils/file-operations.js';
export function createReadFileTool() {
    return {
        name: "read_file",
        description: "Read any file from the Learning Notebook project with full content and contextual understanding",
        inputSchema: {
            type: "object",
            properties: {
                filePath: {
                    type: "string",
                    description: "Relative path to the file from project root (e.g., 'src/app/app.component.ts')"
                }
            },
            required: ["filePath"]
        },
        handler: async ({ filePath }) => {
            try {
                const fullPath = await validateFilePath(filePath);
                const content = await readFile(fullPath, 'utf-8');
                const relativePath = relative(ANGULAR_PROJECT_PATH, fullPath);
                const fileSize = (await stat(fullPath)).size;
                const extension = extname(fullPath);
                // Get file type context
                let fileTypeContext = "";
                switch (extension) {
                    case '.ts':
                        fileTypeContext = "TypeScript file - Part of Angular 19 application using standalone components and signals";
                        break;
                    case '.html':
                        fileTypeContext = "Angular template file - Uses Tailwind CSS v4 design system and modern Angular template syntax";
                        break;
                    case '.scss':
                        fileTypeContext = "SCSS stylesheet - Integrates with Tailwind v4 CSS-First API design tokens";
                        break;
                    case '.css':
                        fileTypeContext = "CSS file - Contains Tailwind v4 design system tokens and global styles";
                        break;
                    case '.json':
                        fileTypeContext = "JSON configuration file - Project configuration or data file";
                        break;
                    case '.md':
                        fileTypeContext = "Markdown documentation file - Project documentation";
                        break;
                    case '.js':
                        fileTypeContext = "JavaScript file - Build configuration or utility script";
                        break;
                    default:
                        fileTypeContext = "Project file";
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: `# 📄 File: ${relativePath}

## 📋 File Information
- **Full Path:** \`${fullPath}\`
- **Size:** ${fileSize} bytes
- **Type:** ${fileTypeContext}
- **Extension:** ${extension}

## 🎯 Project Context
This file is part of the **Learning Notebook Angular 19 project** - a modern, AI-powered note-taking application with:
- Angular 19.2.0 with standalone components and signals
- Tailwind CSS v4 with CSS-First API design system
- IndexedDB for local-first data storage
- Comprehensive TypeScript interfaces (50+)
- Production-ready component library (9 components)

## 📝 File Content

\`\`\`${extension.substring(1)}
${content}
\`\`\`

---
*File successfully read from Learning Notebook project. This content represents the current state of the file in the Angular application.*`
                        }
                    ]
                };
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `❌ **Error reading file:** \`${filePath}\`

**Error Details:** ${error instanceof Error ? error.message : 'Unknown error'}

## 📝 Common File Paths in Learning Notebook Project:

### 🔧 Core Application Files
- \`src/app/app.component.ts\` - Main application component
- \`src/app/app.routes.ts\` - Application routing configuration
- \`src/app/app.config.ts\` - Application configuration
- \`package.json\` - Project dependencies and scripts

### 🎨 UI Components
- \`src/app/shared/components/ui/button/button.component.ts\`
- \`src/app/shared/components/ui/stats-card/stats-card.component.ts\`
- \`src/app/shared/components/ui/note-card/note-card.component.ts\`

### 🔧 Core Services
- \`src/app/core/services/layout.service.ts\`
- \`src/app/core/services/theme.service.ts\`
- \`src/app/core/services/storage/local-storage.service.ts\`

### 🏗️ Layout Components
- \`src/app/layout/header/header.component.ts\`
- \`src/app/layout/sidebar/sidebar.component.ts\`
- \`src/app/layout/main-content/main-content.component.ts\`

### 📊 Feature Components
- \`src/app/features/dashboard/dashboard.component.ts\`

### 🎨 Styling
- \`src/styles.css\` - Main styles with Tailwind v4 design system
- \`angular.json\` - Angular CLI configuration

**Allowed file types:** ${ALLOWED_EXTENSIONS.join(', ')}`
                        }
                    ]
                };
            }
        }
    };
}
//# sourceMappingURL=read-file.js.map