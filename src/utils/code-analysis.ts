import { readFile } from 'fs/promises';

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
export async function parseTypeScriptFile(filePath: string): Promise<FileContext> {
  try {
    const content = await readFile(filePath, 'utf-8');
    
    return {
      imports: extractImports(content),
      exports: extractExports(content),
      dependencies: extractDependencies(content),
      interfaces: extractInterfaces(content),
      methods: extractMethods(content),
      components: extractComponentUsage(content),
      services: extractServiceUsage(content)
    };
  } catch (error) {
    return {};
  }
}

/**
 * Extract comprehensive file context based on file type
 */
export async function extractFileContext(filePath: string, fileType: string): Promise<FileContext> {
  switch (fileType) {
    case 'component':
    case 'service':
    case 'typescript':
      return parseTypeScriptFile(filePath);
    
    case 'template':
      return parseTemplateFile(filePath);
    
    case 'interface':
      return parseInterfaceFile(filePath);
    
    default:
      return {};
  }
}

/**
 * Extract import statements from TypeScript content
 */
function extractImports(content: string): string[] {
  const imports: string[] = [];
  const importRegex = /import\s+(?:{([^}]+)}|\*\s+as\s+(\w+)|(\w+))\s+from\s+['"]([^'"]+)['"]/g;
  
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    if (match[1]) {
      // Named imports: { Component, Input }
      const namedImports = match[1].split(',').map(imp => imp.trim());
      imports.push(...namedImports);
    } else if (match[2]) {
      // Namespace import: * as Something
      imports.push(match[2]);
    } else if (match[3]) {
      // Default import
      imports.push(match[3]);
    }
  }
  
  return [...new Set(imports)]; // Remove duplicates
}

/**
 * Extract export statements
 */
function extractExports(content: string): string[] {
  const exports: string[] = [];
  
  // Export class/interface/function/const
  const exportRegex = /export\s+(?:class|interface|function|const|let|var|enum|type)\s+(\w+)/g;
  let match;
  while ((match = exportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }
  
  // Export { ... }
  const namedExportRegex = /export\s+{([^}]+)}/g;
  while ((match = namedExportRegex.exec(content)) !== null) {
    const namedExports = match[1].split(',').map(exp => exp.trim());
    exports.push(...namedExports);
  }
  
  return [...new Set(exports)];
}

/**
 * Extract Angular dependencies (components, services, etc.)
 */
function extractDependencies(content: string): string[] {
  const dependencies: string[] = [];
  
  // Component imports in standalone components
  const importsMatch = content.match(/imports:\s*\[([\s\S]*?)\]/);
  if (importsMatch) {
    const importsList = importsMatch[1];
    const componentMatches = importsList.match(/(\w+Component|\w+Directive|\w+Pipe)/g);
    if (componentMatches) {
      dependencies.push(...componentMatches);
    }
  }
  
  // Injected services
  const injectMatches = content.match(/inject\((\w+)\)/g);
  if (injectMatches) {
    injectMatches.forEach(match => {
      const serviceMatch = match.match(/inject\((\w+)\)/);
      if (serviceMatch) {
        dependencies.push(serviceMatch[1]);
      }
    });
  }
  
  // Constructor injection
  const constructorMatch = content.match(/constructor\(([\s\S]*?)\)/);
  if (constructorMatch) {
    const params = constructorMatch[1];
    const serviceMatches = params.match(/:\s*(\w+Service|\w+Client)/g);
    if (serviceMatches) {
      serviceMatches.forEach(match => {
        const serviceMatch = match.match(/:\s*(\w+)/);
        if (serviceMatch) {
          dependencies.push(serviceMatch[1]);
        }
      });
    }
  }
  
  return [...new Set(dependencies)];
}

/**
 * Extract TypeScript interfaces
 */
function extractInterfaces(content: string): string[] {
  const interfaces: string[] = [];
  const interfaceRegex = /(?:export\s+)?interface\s+(\w+)/g;
  
  let match;
  while ((match = interfaceRegex.exec(content)) !== null) {
    interfaces.push(match[1]);
  }
  
  // Also extract type aliases
  const typeRegex = /(?:export\s+)?type\s+(\w+)/g;
  while ((match = typeRegex.exec(content)) !== null) {
    interfaces.push(match[1]);
  }
  
  return [...new Set(interfaces)];
}

/**
 * Extract public methods from classes
 */
function extractMethods(content: string): string[] {
  const methods: string[] = [];
  
  // Public methods (including getters/setters)
  const methodRegex = /(?:public\s+)?(?:readonly\s+)?(?:get\s+|set\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*[^{]+)?{/g;
  
  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const methodName = match[1];
    // Filter out constructor and common Angular lifecycle methods
    if (!['constructor', 'ngOnInit', 'ngOnDestroy', 'ngOnChanges'].includes(methodName)) {
      methods.push(methodName);
    }
  }
  
  return [...new Set(methods)];
}

/**
 * Extract component usage from templates or TypeScript
 */
function extractComponentUsage(content: string): string[] {
  const components: string[] = [];
  
  // HTML tag usage: <app-button>, <app-stats-card>
  const tagRegex = /<(app-[\w-]+)/g;
  let match;
  while ((match = tagRegex.exec(content)) !== null) {
    components.push(match[1]);
  }
  
  // TypeScript component references
  const componentRefRegex = /(\w+Component)/g;
  while ((match = componentRefRegex.exec(content)) !== null) {
    components.push(match[1]);
  }
  
  return [...new Set(components)];
}

/**
 * Extract service usage
 */
function extractServiceUsage(content: string): string[] {
  const services: string[] = [];
  
  // Service injection patterns
  const serviceRegex = /(\w+Service|\w+Client)/g;
  let match;
  while ((match = serviceRegex.exec(content)) !== null) {
    services.push(match[1]);
  }
  
  return [...new Set(services)];
}

/**
 * Parse HTML template files
 */
async function parseTemplateFile(filePath: string): Promise<FileContext> {
  try {
    const content = await readFile(filePath, 'utf-8');
    
    return {
      components: extractComponentUsage(content),
      // Could add more template-specific parsing here
    };
  } catch (error) {
    return {};
  }
}

/**
 * Parse interface/model files
 */
async function parseInterfaceFile(filePath: string): Promise<FileContext> {
  try {
    const content = await readFile(filePath, 'utf-8');
    
    return {
      interfaces: extractInterfaces(content),
      exports: extractExports(content),
      // Type definitions often import from other files
      imports: extractImports(content)
    };
  } catch (error) {
    return {};
  }
}

/**
 * Analyze component relationships across the project
 */
export async function analyzeComponentRelationships(projectPath: string): Promise<Map<string, string[]>> {
  // This could be expanded to build a dependency graph
  // For now, return empty map
  return new Map();
}