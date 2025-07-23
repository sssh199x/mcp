import { readFile, access, stat, readdir } from 'fs/promises';
import { join, resolve, relative, extname } from 'path';
export const ANGULAR_PROJECT_PATH = resolve(process.cwd(), "../learning-notebook");
export const ALLOWED_EXTENSIONS = ['.ts', '.html', '.scss', '.css', '.json', '.md', '.js'];
/**
 * Utility function to validate file path and check permissions
 */
export async function validateFilePath(filePath) {
    const fullPath = resolve(ANGULAR_PROJECT_PATH, filePath);
    // Security check: ensure file is within project directory
    if (!fullPath.startsWith(resolve(ANGULAR_PROJECT_PATH))) {
        throw new Error('File path is outside project directory');
    }
    // Check file extension
    const ext = extname(fullPath);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        throw new Error(`File type ${ext} not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`);
    }
    // Check if file exists and is readable
    try {
        await access(fullPath);
        const stats = await stat(fullPath);
        if (!stats.isFile()) {
            throw new Error('Path is not a file');
        }
    }
    catch (error) {
        throw new Error(`File not accessible: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    return fullPath;
}
/**
 * Helper function to perform the actual search
 */
export async function performSearch(searchDir, query, allowedTypes) {
    const results = [];
    const searchFiles = async (dir) => {
        try {
            const items = await readdir(dir, { withFileTypes: true });
            for (const item of items) {
                const fullPath = join(dir, item.name);
                if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules' && item.name !== 'dist') {
                    await searchFiles(fullPath);
                }
                else if (item.isFile() && allowedTypes.includes(extname(item.name))) {
                    try {
                        const content = await readFile(fullPath, 'utf-8');
                        const lines = content.split('\n');
                        lines.forEach((line, index) => {
                            if (line.toLowerCase().includes(query.toLowerCase())) {
                                results.push({
                                    file: relative(ANGULAR_PROJECT_PATH, fullPath),
                                    line: index + 1,
                                    context: line.trim(),
                                    excerpt: lines.slice(Math.max(0, index - 2), index + 3).join('\n'),
                                });
                            }
                        });
                    }
                    catch {
                        // Skip files that can't be read
                    }
                }
            }
        }
        catch {
            // Skip directories that can't be read
        }
    };
    await searchFiles(searchDir);
    return results.slice(0, 50); // Limit to 50 results for performance
}
/**
 * Count total searchable files
 */
export async function countSearchableFiles(searchDir, allowedTypes) {
    let count = 0;
    const countFiles = async (dir) => {
        try {
            const items = await readdir(dir, { withFileTypes: true });
            for (const item of items) {
                const fullPath = join(dir, item.name);
                if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules' && item.name !== 'dist') {
                    await countFiles(fullPath);
                }
                else if (item.isFile() && allowedTypes.includes(extname(item.name))) {
                    count++;
                }
            }
        }
        catch {
            // Skip directories that can't be read
        }
    };
    await countFiles(searchDir);
    return count;
}
/**
 * Generate search analysis based on results
 */
export function generateSearchAnalysis(results, query) {
    if (results.length === 0)
        return "No patterns found.";
    const fileTypes = [...new Set(results.map(r => extname(r.file)))];
    const directories = [...new Set(results.map(r => r.file.split('/')[0]))];
    return `### Pattern Distribution
- **File Types**: ${fileTypes.join(', ')}
- **Directories**: ${directories.join(', ')}
- **Most Common**: ${getMostCommonDirectory(results)}

### Usage Context
${getUsageContext(results, query)}`;
}
/**
 * Generate related search suggestions
 */
export function generateRelatedSearches(query, results) {
    const suggestions = [];
    // Based on common Angular patterns
    if (query.toLowerCase().includes('component')) {
        suggestions.push('selector', 'template', 'standalone');
    }
    else if (query.toLowerCase().includes('service')) {
        suggestions.push('inject', 'injectable', 'provider');
    }
    else if (query.toLowerCase().includes('signal')) {
        suggestions.push('computed', 'effect', 'set');
    }
    else if (query.toLowerCase().includes('interface')) {
        suggestions.push('type', 'export', 'extends');
    }
    // Add generic suggestions
    suggestions.push(query + ' component', query + ' service', query + ' interface');
    return suggestions.slice(0, 5);
}
/**
 * Get most common directory from results
 */
function getMostCommonDirectory(results) {
    const dirCounts = results.reduce((acc, result) => {
        const dir = result.file.split('/')[0];
        acc[dir] = (acc[dir] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(dirCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Unknown';
}
/**
 * Get usage context analysis
 */
function getUsageContext(results, query) {
    const contexts = results.slice(0, 5).map(r => r.context);
    // Simple analysis of common patterns
    const hasImports = contexts.some(c => c.includes('import'));
    const hasDecorators = contexts.some(c => c.includes('@'));
    const hasClasses = contexts.some(c => c.includes('class'));
    const hasInterfaces = contexts.some(c => c.includes('interface'));
    let analysis = '';
    if (hasImports)
        analysis += '- Found in import statements\n';
    if (hasDecorators)
        analysis += '- Found in decorators/annotations\n';
    if (hasClasses)
        analysis += '- Found in class definitions\n';
    if (hasInterfaces)
        analysis += '- Found in interface definitions\n';
    return analysis || '- Various usage contexts found';
}
//# sourceMappingURL=file-operations.js.map