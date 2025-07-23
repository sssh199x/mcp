import { readFile, readdir, stat } from 'fs/promises';
import { join, extname, relative } from 'path';
import type { ComponentInfo, ServiceInfo } from '../types/index.js';
import { ANGULAR_PROJECT_PATH } from './file-operations.js';

export async function findComponentFiles(dir: string): Promise<ComponentInfo[]> {
  const components: ComponentInfo[] = [];
  
  const searchFiles = async (currentDir: string) => {
    try {
      const items = await readdir(currentDir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = join(currentDir, item.name);
        
        if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
          await searchFiles(fullPath);
        } else if (item.name.endsWith('.component.ts')) {
          try {
            const content = await readFile(fullPath, 'utf-8');
            const stats = await stat(fullPath);
            const relativePath = relative(ANGULAR_PROJECT_PATH, fullPath);
            
            components.push({
              name: item.name.replace('.component.ts', ''),
              path: relativePath,
              type: getComponentType(relativePath),
              sizeKB: Math.round(stats.size / 1024 * 100) / 100,
              features: analyzeComponentFeatures(content)
            });
          } catch {
            // Skip files that can't be read
          }
        }
      }
    } catch {
      // Skip directories that can't be read
    }
  };
  
  await searchFiles(dir);
  return components;
}

export async function findServiceFiles(dir: string): Promise<ServiceInfo[]> {
  const services: ServiceInfo[] = [];
  
  const searchFiles = async (currentDir: string) => {
    try {
      const items = await readdir(currentDir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = join(currentDir, item.name);
        
        if (item.isDirectory()) {
          await searchFiles(fullPath);
        } else if (item.name.endsWith('.service.ts')) {
          try {
            const content = await readFile(fullPath, 'utf-8');
            const relativePath = relative(ANGULAR_PROJECT_PATH, fullPath);
            
            services.push({
              name: item.name.replace('.service.ts', ''),
              path: relativePath,
              purpose: getServicePurpose(item.name, content),
              category: getServiceCategory(relativePath),
              patterns: analyzeServicePatterns(content),
              dependencies: analyzeServiceDependencies(content)
            });
          } catch {
            // Skip files that can't be read
          }
        }
      }
    } catch {
      // Skip directories that can't be read
    }
  };
  
  await searchFiles(dir);
  return services;
}

export function getComponentType(path: string): string {
  if (path.includes('shared/components/ui')) return 'UI Component';
  if (path.includes('layout/')) return 'Layout Component';
  if (path.includes('features/')) return 'Feature Component';
  if (path.includes('app.component')) return 'Root Component';
  return 'Component';
}

export function analyzeComponentFeatures(content: string): string[] {
  const features: string[] = [];
  
  if (content.includes('standalone: true')) features.push('Standalone');
  if (content.includes('signal(')) features.push('Signals');
  if (content.includes('computed(')) features.push('Computed');
  if (content.includes('inject(')) features.push('inject()');
  if (content.includes('@Input')) features.push('Inputs');
  if (content.includes('@Output')) features.push('Outputs');
  if (content.includes('OnInit')) features.push('Lifecycle');
  if (content.includes('aria-')) features.push('Accessibility');
  
  return features;
}

export function getServicePurpose(name: string, content: string): string {
  const purposeMap: Record<string, string> = {
    'layout.service.ts': 'Responsive layout and sidebar state management',
    'theme.service.ts': 'Dark/light theme switching with system detection',
    'local-storage.service.ts': 'IndexedDB data persistence with reactive updates'
  };
  
  return purposeMap[name] || 'Angular service providing application functionality';
}

export function getServiceCategory(path: string): string {
  if (path.includes('core/services')) return 'core';
  if (path.includes('shared/services')) return 'utility';
  if (path.includes('storage')) return 'data';
  return 'utility';
}

export function analyzeServicePatterns(content: string): string[] {
  const patterns: string[] = [];
  
  if (content.includes('Injectable')) patterns.push('Injectable');
  if (content.includes('signal(')) patterns.push('Signals');
  if (content.includes('BehaviorSubject')) patterns.push('Reactive');
  if (content.includes('inject(')) patterns.push('Modern DI');
  if (content.includes('computed(')) patterns.push('Computed');
  if (content.includes('providedIn: \'root\'')) patterns.push('Singleton');
  
  return patterns;
}

export function analyzeServiceDependencies(content: string): string[] {
  const dependencies: string[] = [];
  const imports = content.match(/import.*from ['"].*['"];/g) || [];
  
  imports.forEach(imp => {
    if (imp.includes('@angular/core')) dependencies.push('Angular Core');
    if (imp.includes('rxjs')) dependencies.push('RxJS');
    if (imp.includes('./')) dependencies.push('Local Service');
  });
  
  return [...new Set(dependencies)];
}

export function getAverageTemplateComplexity(components: ComponentInfo[]): string {
  // Simple heuristic based on component types
  const uiComponents = components.filter(c => c.type === 'UI Component').length;
  const totalComponents = components.length;
  
  if (uiComponents / totalComponents > 0.6) return 'Low (UI-focused)';
  if (uiComponents / totalComponents > 0.3) return 'Medium (Mixed)';
  return 'High (Feature-rich)';
}

export function getModelDescription(modelName: string): string {
  const descriptions: Record<string, string> = {
    'User': 'User account and preference management',
    'Note': 'Core note entity with block-based content',
    'Notebook': 'Note organization and categorization',
    'Tag': 'Content tagging and filtering system',
    'StudySession': 'Learning progress and analytics tracking',
    'AIInsight': 'AI-generated recommendations and insights',
    'SearchResult': 'Search functionality and result handling'
  };
  
  return descriptions[modelName] || 'Data model for application entities';
}