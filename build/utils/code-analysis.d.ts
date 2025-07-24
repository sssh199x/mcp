export interface FileContext {
    imports?: string[];
    exports?: string[];
    dependencies?: string[];
    interfaces?: string[];
    methods?: string[];
    components?: string[];
    services?: string[];
}
/**
 * Parse TypeScript file and extract code structure
 */
export declare function parseTypeScriptFile(filePath: string): Promise<FileContext>;
/**
 * Extract comprehensive file context based on file type
 */
export declare function extractFileContext(filePath: string, fileType: string): Promise<FileContext>;
/**
 * Analyze component relationships across the project
 */
export declare function analyzeComponentRelationships(projectPath: string): Promise<Map<string, string[]>>;
//# sourceMappingURL=code-analysis.d.ts.map