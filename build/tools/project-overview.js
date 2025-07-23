import { ANGULAR_PROJECT_PATH } from '../utils/file-operations.js';
export function createProjectOverviewTool() {
    return {
        name: "get_project_overview",
        description: "Get comprehensive overview of the Learning Notebook Angular project including architecture, tech stack, and current status",
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        },
        handler: async () => {
            const overview = {
                projectName: "Learning Notebook App",
                description: "A modern, AI-powered note-taking and learning management application built with Angular 19",
                projectPath: ANGULAR_PROJECT_PATH,
                techStack: {
                    frontend: "Angular 19.2.0 (Standalone Components)",
                    styling: "Tailwind CSS v4 with CSS-First API",
                    stateManagement: "Angular Signals + RxJS Observables",
                    dataStorage: "IndexedDB with comprehensive service layer",
                    buildSystem: "Angular CLI with optimized production builds",
                    packageManager: "npm",
                    typescript: "5.7.2 with strict mode enabled"
                },
                architecture: {
                    designPhilosophy: [
                        "Modern Angular: Latest features including standalone components, signals, and inject()",
                        "Design System Driven: Comprehensive design tokens and component library",
                        "Performance First: Signal-based reactivity and optimized rendering",
                        "Accessibility: WCAG 2.1 AA compliance throughout",
                        "Mobile First: Responsive design with progressive enhancement",
                        "Type Safety: Full TypeScript coverage with strict mode"
                    ],
                    coreFeatures: [
                        "📝 Block-Based Editor - Rich, flexible content creation with support for text, code, images, tables",
                        "🤖 AI-Powered Insights - Intelligent suggestions, content analysis, and personalized learning recommendations",
                        "📊 Learning Analytics - Progress tracking, study goals, streak counters, and performance insights",
                        "🔍 Advanced Search - Full-text search with highlighting, filtering, and smart suggestions",
                        "📁 Smart Organization - Nested notebooks, tagging system, and content categorization",
                        "🌙 Dark Mode - Beautiful light/dark theme with system preference detection",
                        "📱 Responsive Design - Mobile-first approach that works perfectly on all devices",
                        "♿ Accessibility First - WCAG compliant with comprehensive screen reader support",
                        "💾 Local-First - All data stored locally with IndexedDB for offline functionality",
                        "⚡ Real-time Updates - Live reactive updates using Angular Signals"
                    ]
                },
                currentStatus: {
                    overallProgress: "~85% Complete - Production Ready Foundation",
                    completed: [
                        "✅ Complete project setup and architecture",
                        "✅ Design System: Production-ready Tailwind v4 implementation",
                        "✅ Core Services: LocalStorage with IndexedDB integration",
                        "✅ UI Library: 8 reusable components with full documentation",
                        "✅ Layout System: Responsive header, sidebar, and main content",
                        "✅ Dashboard: Fully functional with real data integration",
                        "✅ Theme System: Light/dark mode with system detection",
                        "✅ Routing: Navigation structure and lazy loading",
                        "✅ Data Models: 50+ TypeScript interfaces with comprehensive coverage"
                    ],
                    readyForDevelopment: [
                        "🚧 Note Editor: Rich text editing with block system",
                        "🚧 Search Interface: UI for existing search service",
                        "🚧 Notebook Management: CRUD operations for notebook organization",
                        "🚧 AI Integration: Connect to LLM services for intelligent features",
                        "🚧 Settings Page: User preferences and application configuration"
                    ],
                    futureRoadmap: [
                        "🔮 Cloud Synchronization: Multi-device data sync",
                        "🔮 Collaboration: Shared notebooks and real-time editing",
                        "🔮 Mobile App: Native mobile application",
                        "🔮 Advanced AI: Deeper learning analytics and recommendations",
                        "🔮 Plugin System: Extensible architecture for third-party integrations"
                    ]
                },
                projectStructure: {
                    root: "learning-notebook/",
                    keyDirectories: {
                        "src/app/core/": "Core business logic, models (50+ TypeScript interfaces), and services",
                        "src/app/features/": "Feature modules like dashboard component",
                        "src/app/layout/": "Application layout (header, sidebar, main-content)",
                        "src/app/shared/components/ui/": "Reusable UI component library (8+ components)",
                        "src/styles.css": "Design system foundation with Tailwind v4 CSS-First API"
                    }
                },
                componentLibrary: [
                    "AnimatedTextComponent: Stunning text animations with customizable colors",
                    "ButtonComponent: 7 variants with shine animations and accessibility",
                    "StatsCardComponent: Dashboard statistics with trend indicators",
                    "NoteCardComponent: Rich note display with progress tracking",
                    "EmptyStateComponent: Beautiful empty states with actions",
                    "AIInsightCardComponent: AI-powered recommendations and insights",
                    "ProgressCardComponent: Goal tracking with streaks and celebrations",
                    "QuickActionsGridComponent: Customizable action grids",
                    "ThemeToggleComponent: Light/dark mode switching"
                ]
            };
            return {
                content: [
                    {
                        type: "text",
                        text: `# 📚 Learning Notebook Project Overview

## 🎯 Project Summary
**${overview.projectName}** - ${overview.description}

**Location:** \`${overview.projectPath}\`

## 🛠️ Technology Stack
${Object.entries(overview.techStack).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

## 🏗️ Architecture Overview

### Design Philosophy
${overview.architecture.designPhilosophy.map(principle => `- ${principle}`).join('\n')}

### Core Features
${overview.architecture.coreFeatures.join('\n')}

## 📊 Development Status
**${overview.currentStatus.overallProgress}**

### ✅ Completed Features
${overview.currentStatus.completed.join('\n')}

### 🚧 Ready for Development  
${overview.currentStatus.readyForDevelopment.join('\n')}

### 🔮 Future Roadmap
${overview.currentStatus.futureRoadmap.join('\n')}

## 📁 Project Structure
**Root:** ${overview.projectStructure.root}

${Object.entries(overview.projectStructure.keyDirectories).map(([path, desc]) => `- **${path}**: ${desc}`).join('\n')}

## 🎨 Component Library (9 Components)
${overview.componentLibrary.map(comp => `- ${comp}`).join('\n')}

## 🗄️ Data Architecture Highlights
- **50+ TypeScript interfaces** covering all entities and use cases
- **IndexedDB integration** with reactive BehaviorSubjects for real-time updates
- **Full CRUD operations** with advanced search and filtering capabilities
- **Dashboard statistics** computed from actual data in real-time
- **Block-based content system** for rich note formatting and flexibility

This is a sophisticated, production-ready Angular application with modern architecture, comprehensive component library, and robust data management perfect for AI-powered learning and note-taking.`
                    }
                ]
            };
        }
    };
}
//# sourceMappingURL=project-overview.js.map