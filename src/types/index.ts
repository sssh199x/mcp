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

// Enhanced search result with rich context for code completion
export interface EnhancedSearchResult extends SearchResult {
  fileType: 'component' | 'service' | 'interface' | 'template' | 'style' | 'typescript' | 'other';
  imports?: string[];           // What this file imports
  exports?: string[];           // What this file exports  
  dependencies?: string[];      // Component/service dependencies
  interfaces?: string[];        // TypeScript interfaces defined
  methods?: string[];           // Public methods available
  components?: string[];        // Components used in this file
  services?: string[];          // Services used in this file
  relevanceScore?: number;      // Search relevance score (0-10)
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

// File context for code analysis
export interface FileContext {
  imports?: string[];
  exports?: string[];
  dependencies?: string[];
  interfaces?: string[];
  methods?: string[];
  components?: string[];
  services?: string[];
}

// MCP-specific types matching the SDK expectations
export interface ToolResponse {
  [x: string]: unknown;
  content: Array<{
    type: 'text';
    text: string;
  }>;
  _meta?: { [x: string]: unknown } | undefined;
  structuredContent?: { [x: string]: unknown } | undefined;
  isError?: boolean | undefined;
}