import type { ComponentInfo, ServiceInfo } from '../types/index.js';
export declare function findComponentFiles(dir: string): Promise<ComponentInfo[]>;
export declare function findServiceFiles(dir: string): Promise<ServiceInfo[]>;
export declare function getComponentType(path: string): string;
export declare function analyzeComponentFeatures(content: string): string[];
export declare function getServicePurpose(name: string, content: string): string;
export declare function getServiceCategory(path: string): string;
export declare function analyzeServicePatterns(content: string): string[];
export declare function analyzeServiceDependencies(content: string): string[];
export declare function getAverageTemplateComplexity(components: ComponentInfo[]): string;
export declare function getModelDescription(modelName: string): string;
//# sourceMappingURL=analysis-helper.d.ts.map