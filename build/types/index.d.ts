export interface ProjectOverview {
    projectName: string;
    description: string;
    projectPath: string;
    techStack: {
        frontend: string;
        styling: string;
        stateManagement: string;
        dataStorage: string;
        buildSystem: string;
        packageManager: string;
        typescript: string;
    };
    architecture: {
        designPhilosophy: string[];
        coreFeatures: string[];
    };
    currentStatus: {
        overallProgress: string;
        completed: string[];
        readyForDevelopment: string[];
        futureRoadmap: string[];
    };
    projectStructure: {
        root: string;
        keyDirectories: Record<string, string>;
    };
    componentLibrary: string[];
}
export interface SearchQuery {
    query: string;
    fileTypes?: string[];
    directory?: string;
    includeContext?: boolean;
}
export interface SearchResult {
    file: string;
    line: number;
    context: string;
    excerpt: string;
}
export interface EnhancedSearchResult extends SearchResult {
    fileType: 'component' | 'service' | 'interface' | 'template' | 'style' | 'typescript' | 'other';
    imports?: string[];
    exports?: string[];
    dependencies?: string[];
    interfaces?: string[];
    methods?: string[];
    components?: string[];
    services?: string[];
    relevanceScore?: number;
}
export interface ComponentInfo {
    name: string;
    path: string;
    type: string;
    sizeKB: number;
    features: string[];
}
export interface ServiceInfo {
    name: string;
    path: string;
    purpose: string;
    category: string;
    patterns: string[];
    dependencies: string[];
}
export interface AnalysisOptions {
    focusArea: 'components' | 'services' | 'routing' | 'models' | 'patterns' | 'all';
}
export interface FileValidationResult {
    isValid: boolean;
    fullPath: string;
    error?: string;
}
export interface ArchitectureAnalysis {
    components?: ComponentInfo[];
    services?: ServiceInfo[];
    routing?: any;
    models?: any;
    patterns?: any;
}
export interface FileContext {
    imports?: string[];
    exports?: string[];
    dependencies?: string[];
    interfaces?: string[];
    methods?: string[];
    components?: string[];
    services?: string[];
}
export interface ToolResponse {
    [x: string]: unknown;
    content: Array<{
        type: 'text';
        text: string;
    }>;
    _meta?: {
        [x: string]: unknown;
    } | undefined;
    structuredContent?: {
        [x: string]: unknown;
    } | undefined;
    isError?: boolean | undefined;
}
//# sourceMappingURL=index.d.ts.map