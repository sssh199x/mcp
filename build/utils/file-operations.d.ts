import type { SearchResult } from '../types/index.js';
export declare const ANGULAR_PROJECT_PATH: string;
export declare const ALLOWED_EXTENSIONS: string[];
/**
 * Utility function to validate file path and check permissions
 */
export declare function validateFilePath(filePath: string): Promise<string>;
/**
 * Helper function to perform the actual search
 */
export declare function performSearch(searchDir: string, query: string, allowedTypes: string[]): Promise<SearchResult[]>;
/**
 * Count total searchable files
 */
export declare function countSearchableFiles(searchDir: string, allowedTypes: string[]): Promise<number>;
/**
 * Generate search analysis based on results
 */
export declare function generateSearchAnalysis(results: SearchResult[], query: string): string;
/**
 * Generate related search suggestions
 */
export declare function generateRelatedSearches(query: string, results: SearchResult[]): string[];
//# sourceMappingURL=file-operations.d.ts.map