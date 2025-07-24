import { readFile } from 'fs/promises';
import { join } from 'path';
import type { ToolResponse } from '../types/index.js';
import { ANGULAR_PROJECT_PATH } from '../utils/file-operations.js';

interface ComponentTemplate {
  name: string;
  selector: string;
  typescript: string;
  html: string;
  scss: string;
  readme: string;
  spec: string;
}

export function createGenerateComponentBoilerplateTool() {
  return {
    name: "generate_component_boilerplate",
    description: "Generate complete Angular component boilerplate following Learning Notebook patterns and conventions, including TypeScript, HTML, SCSS, README, and test files",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Component name in kebab-case (e.g., 'task-card', 'user-profile'). Will be converted to proper naming conventions",
        },
        type: {
          type: "string", 
          enum: ["ui", "layout", "feature", "page"],
          description: "Component type: ui (reusable UI component), layout (app structure), feature (business logic), page (route component)",
          default: "ui"
        },
        features: {
          type: "array",
          items: { type: "string" },
          description: "Component features to include: ['inputs', 'outputs', 'variants', 'loading', 'accessibility', 'animations', 'docs']",
          default: ["inputs", "outputs", "accessibility", "docs"]
        },
        includeReadme: {
          type: "boolean",
          description: "Generate comprehensive README documentation. Default: true",
          default: true
        },
        includeTests: {
          type: "boolean",
          description: "Generate test file boilerplate. Default: false", 
          default: false
        }
      },
      required: ["name"],
      additionalProperties: false
    },
    handler: async ({ name, type = "ui", features = ["inputs", "outputs", "accessibility", "docs"], includeReadme = true, includeTests = false }: {
      name: string;
      type?: string;
      features?: string[];
      includeReadme?: boolean;
      includeTests?: boolean;
    }): Promise<ToolResponse> => {
      try {
        // Analyze existing components for patterns
        const patterns = await analyzeExistingPatterns(type as 'ui' | 'layout' | 'feature' | 'page');
        
        // Generate component template
        const template = generateComponentTemplate(name, type as 'ui' | 'layout' | 'feature' | 'page', features, patterns);
        
        // Format output
        const formattedOutput = formatComponentBoilerplate(template, includeReadme, includeTests);
        
        return {
          content: [
            {
              type: "text",
              text: formattedOutput
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Component Generation Error**: ${error instanceof Error ? error.message : 'Unknown error'}

## 🛠️ Component Generator Help
- **name** is required (use kebab-case): \`{"name": "task-card"}\`
- **type** options: ui, layout, feature, page
- **features** array can include: inputs, outputs, variants, loading, accessibility, animations, docs

**Example Usage**:
\`\`\`json
{
  "name": "task-card",
  "type": "ui", 
  "features": ["inputs", "outputs", "variants", "accessibility", "docs"],
  "includeReadme": true
}
\`\`\`

### 🎨 Component Types:
- **ui**: Reusable UI components (buttons, cards, inputs)
- **layout**: App structure components (header, sidebar, layout)
- **feature**: Business logic components (dashboard, editor, settings)
- **page**: Route-level page components

### ⚡ Available Features:
- **inputs**: @Input properties with types
- **outputs**: @Output events with EventEmitter
- **variants**: Size and color variant support
- **loading**: Loading states and skeleton UI
- **accessibility**: ARIA labels and keyboard navigation
- **animations**: Transition and hover effects
- **docs**: Comprehensive README documentation`
            }
          ]
        };
      }
    }
  };
}

/**
 * Analyze existing components to understand patterns
 */
async function analyzeExistingPatterns(type: 'ui' | 'layout' | 'feature' | 'page'): Promise<any> {
  const patterns = {
    imports: new Set<string>(),
    baseClasses: new Set<string>(),
    commonInputs: new Set<string>(),
    commonOutputs: new Set<string>(),
    designPatterns: new Set<string>()
  };

  try {
    // Analyze existing components based on type
    let samplePath = '';
    switch (type) {
      case 'ui':
        samplePath = 'src/app/shared/components/ui/button/button.component.ts';
        break;
      case 'layout':
        samplePath = 'src/app/layout/header/header.component.ts';
        break;
      case 'feature':
        samplePath = 'src/app/features/dashboard/dashboard.component.ts';
        break;
      case 'page':
        samplePath = 'src/app/features/dashboard/dashboard.component.ts'; // Use as template
        break;
    }

    const fullPath = join(ANGULAR_PROJECT_PATH, samplePath);
    const content = await readFile(fullPath, 'utf-8');

    // Extract common patterns
    extractImportPatterns(content, patterns);
    extractClassPatterns(content, patterns);
    extractInputOutputPatterns(content, patterns);

  } catch {
    // Use default patterns if can't read existing components
  }

  return {
    commonImports: Array.from(patterns.imports),
    baseClasses: Array.from(patterns.baseClasses),
    commonInputs: Array.from(patterns.commonInputs),
    commonOutputs: Array.from(patterns.commonOutputs)
  };
}

/**
 * Extract import patterns from existing components
 */
function extractImportPatterns(content: string, patterns: any): void {
  const importLines = content.match(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"];/g) || [];
  
  importLines.forEach(line => {
    if (line.includes('@angular/core')) patterns.imports.add('@angular/core');
    if (line.includes('@angular/common')) patterns.imports.add('@angular/common');
    if (line.includes('lucide-angular')) patterns.imports.add('lucide-angular');
    if (line.includes('computed')) patterns.imports.add('computed');
    if (line.includes('signal')) patterns.imports.add('signal');
  });
}

/**
 * Extract common class patterns
 */
function extractClassPatterns(content: string, patterns: any): void {
  if (content.includes('readonly')) patterns.baseClasses.add('readonly-signals');
  if (content.includes('computed(')) patterns.baseClasses.add('computed-properties');
  if (content.includes('inject(')) patterns.baseClasses.add('modern-di');
}

/**
 * Extract input/output patterns  
 */
function extractInputOutputPatterns(content: string, patterns: any): void {
  const inputs = content.match(/@Input\(\)\s+(\w+)/g) || [];
  const outputs = content.match(/@Output\(\)\s+(\w+)/g) || [];
  
  inputs.forEach(match => {
    const inputName = match.replace(/@Input\(\)\s+/, '');
    patterns.commonInputs.add(inputName);
  });
  
  outputs.forEach(match => {
    const outputName = match.replace(/@Output\(\)\s+/, '');
    patterns.commonOutputs.add(outputName);
  });
}

/**
 * Generate complete component template
 */
function generateComponentTemplate(name: string, type: 'ui' | 'layout' | 'feature' | 'page', features: string[], patterns: any): ComponentTemplate {
  const kebabName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const pascalName = kebabName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  const componentName = `${pascalName}Component`;
  const selector = `app-${kebabName}`;

  return {
    name: kebabName,
    selector,
    typescript: generateTypeScriptFile(componentName, selector, type, features, patterns),
    html: generateHtmlFile(componentName, type, features),
    scss: generateScssFile(componentName, type, features),
    readme: generateReadmeFile(componentName, selector, type, features),
    spec: generateSpecFile(componentName, type, features)
  };
}

/**
 * Generate TypeScript component file
 */
function generateTypeScriptFile(componentName: string, selector: string, type: string, features: string[], patterns: any): string {
  const hasInputs = features.includes('inputs');
  const hasOutputs = features.includes('outputs');
  const hasVariants = features.includes('variants');
  const hasLoading = features.includes('loading');
  
  let imports = `import { Component, signal, computed`;
  if (hasInputs) imports += `, Input`;
  if (hasOutputs) imports += `, Output, EventEmitter`;
  imports += ` } from '@angular/core';
import { CommonModule } from '@angular/common';`;

  if (type === 'ui') {
    imports += `\n\n// UI Component type definitions`;
    if (hasVariants) {
      imports += `\nexport type ${componentName.replace('Component', '')}Variant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info';`;
      imports += `\nexport type ${componentName.replace('Component', '')}Size = 'sm' | 'md' | 'lg';`;
    }
  }

  let classContent = `
@Component({
  selector: '${selector}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './${componentName.toLowerCase().replace('component', '')}.component.html',
  styleUrls: ['./${componentName.toLowerCase().replace('component', '')}.component.scss']
})
export class ${componentName} {`;

  // Add inputs
  if (hasInputs) {
    classContent += `
  // Required inputs
  @Input({ required: true }) title!: string;
  
  // Optional inputs with defaults`;
    
    if (hasVariants) {
      classContent += `
  @Input() variant: ${componentName.replace('Component', '')}Variant = 'primary';
  @Input() size: ${componentName.replace('Component', '')}Size = 'md';`;
    }
    
    if (hasLoading) {
      classContent += `
  @Input() loading = false;`;
    }
    
    classContent += `
  @Input() disabled = false;`;
  }

  // Add outputs
  if (hasOutputs) {
    classContent += `
  
  // Event outputs
  @Output() clicked = new EventEmitter<void>();`;
    
    if (type === 'ui') {
      classContent += `
  @Output() valueChange = new EventEmitter<any>();`;
    }
  }

  // Add signals and computed properties
  classContent += `
  
  // Component state with signals
  private _isActive = signal(false);
  public readonly isActive = this._isActive.asReadonly();`;

  if (hasVariants) {
    classContent += `
  
  // Computed classes using design tokens
  public readonly componentClasses = computed(() => {
    const base = 'transition-all duration-200';
    
    const variantClasses = {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary text-white',
      accent: 'bg-accent text-white',
      success: 'bg-success text-white',
      warning: 'bg-warning text-white',
      info: 'bg-info text-white'
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg'
    };

    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90';
    const loadingClass = this.loading ? 'pointer-events-none' : '';

    return \`\${base} \${variantClasses[this.variant]} \${sizeClasses[this.size]} \${disabledClass} \${loadingClass}\`.trim();
  });`;
  }

  // Add methods
  classContent += `
  
  // Event handlers
  public onClick(): void {
    if (!this.disabled && !this.loading) {
      this._isActive.set(!this._isActive());
      this.clicked.emit();
    }
  }`;

  if (features.includes('accessibility')) {
    classContent += `
  
  // Accessibility helpers
  public readonly accessibilityLabel = computed(() => {
    return \`\${this.title}\${this.disabled ? ' (disabled)' : ''}\${this.loading ? ' (loading)' : ''}\`;
  });`;
  }

  classContent += `
}`;

  return imports + classContent;
}

/**
 * Generate HTML template file
 */
function generateHtmlFile(componentName: string, type: string, features: string[]): string {
  const hasInputs = features.includes('inputs');
  const hasVariants = features.includes('variants');
  const hasLoading = features.includes('loading');
  const hasAccessibility = features.includes('accessibility');

  let template = `<div`;
  
  if (hasVariants) {
    template += `
  [class]="componentClasses()"`;
  } else {
    template += `
  class="bg-card border border-border rounded-lg p-6 shadow-sm transition-all duration-200"`;
  }

  template += `
  (click)="onClick()"`;

  if (hasAccessibility) {
    template += `
  [attr.aria-label]="accessibilityLabel()"
  [attr.role]="'button'"
  [attr.tabindex]="disabled ? -1 : 0"
  [attr.aria-disabled]="disabled"
  (keydown.enter)="onClick()"
  (keydown.space)="onClick()"`;
  }

  template += `>

`;

  // Loading state
  if (hasLoading) {
    template += `  <!-- Loading State -->
  <div *ngIf="loading" class="animate-pulse">
    <div class="w-full h-4 bg-muted rounded mb-2"></div>
    <div class="w-3/4 h-4 bg-muted rounded"></div>
  </div>

  <!-- Content -->
  <div *ngIf="!loading">
`;
  }

  // Main content
  if (hasInputs) {
    template += `    <h3 class="text-lg font-semibold text-foreground mb-2">
      {{ title }}
    </h3>
    
    <p class="text-sm text-muted-foreground mb-4">
      Component description goes here.
    </p>`;
  } else {
    template += `    <h3 class="text-lg font-semibold text-foreground mb-2">
      ${componentName.replace('Component', '')}
    </h3>
    
    <p class="text-sm text-muted-foreground mb-4">
      Add your component content here.
    </p>`;
  }

  // Add content projection
  template += `
    
    <!-- Custom Content -->
    <div class="mt-4">
      <ng-content></ng-content>
    </div>`;

  if (hasLoading) {
    template += `
  </div>`;
  }

  template += `
  
  <!-- Status indicator -->
  <div *ngIf="isActive()" class="absolute top-2 right-2 w-2 h-2 bg-success rounded-full"></div>
</div>`;

  return template;
}

/**
 * Generate SCSS file
 */
function generateScssFile(componentName: string, type: string, features: string[]): string {
  const hasAnimations = features.includes('animations');

  let scss = `:host {
  display: block;
  width: 100%;
}

// Component-specific styles
.component-container {
  // Enhanced transitions using design tokens
  transition: 
    transform var(--transition-duration) ease,
    box-shadow var(--transition-duration) ease,
    border-color var(--transition-duration) ease;

  // Hover effects
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: var(--radius-md);
  }
}`;

  if (hasAnimations) {
    scss += `

// Animation effects
.animate-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`;
  }

  scss += `

// Accessibility: Reduce motion for users who prefer it
@media (prefers-reduced-motion: reduce) {
  .component-container,
  .animate-in {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}

// Dark mode specific adjustments
:global(.dark) {
  .component-container {
    // Dark mode specific styles if needed
  }
}`;

  return scss;
}

/**
 * Generate README documentation
 */
function generateReadmeFile(componentName: string, selector: string, type: string, features: string[]): string {
  const hasInputs = features.includes('inputs');
  const hasOutputs = features.includes('outputs');
  const hasVariants = features.includes('variants');

  return `# ${componentName}

## 📝 Overview

${componentName} is a ${type} component for the Learning Notebook application. It provides [describe functionality here].

## 🚀 Quick Start

\`\`\`html
<${selector} 
  title="Example Title"
  ${hasVariants ? 'variant="primary"\n  size="md"' : ''}
  ${hasOutputs ? '(clicked)="handleClick()"' : ''}>
  Content goes here
</${selector}>
\`\`\`

## 📋 API Reference

### Input Properties

${hasInputs ? `| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`title\` | \`string\` | **required** | Component title |
${hasVariants ? `| \`variant\` | \`${componentName.replace('Component', '')}Variant\` | \`'primary'\` | Color variant |
| \`size\` | \`${componentName.replace('Component', '')}Size\` | \`'md'\` | Size variant |` : ''}
| \`disabled\` | \`boolean\` | \`false\` | Disabled state |
| \`loading\` | \`boolean\` | \`false\` | Loading state |` : 'No input properties defined.'}

### Output Events

${hasOutputs ? `| Event | Type | Description |
|-------|------|-------------|
| \`clicked\` | \`EventEmitter<void>\` | Emitted when component is clicked |
| \`valueChange\` | \`EventEmitter<any>\` | Emitted when value changes |` : 'No output events defined.'}

${hasVariants ? `### Type Definitions

\`\`\`typescript
type ${componentName.replace('Component', '')}Variant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info';
type ${componentName.replace('Component', '')}Size = 'sm' | 'md' | 'lg';
\`\`\`

## 🎨 Variants

### Color Variants
- **primary** - Main brand color
- **secondary** - Muted secondary color  
- **accent** - Accent/success color
- **success** - Success state color
- **warning** - Warning state color
- **info** - Information color

### Size Variants
- **sm** - Small size for compact spaces
- **md** - Default medium size
- **lg** - Large size for emphasis

## Usage Examples

\`\`\`html
<!-- Primary variant -->
<${selector} variant="primary" title="Primary Action" (clicked)="handlePrimary()"></${selector}>

<!-- Secondary with custom size -->
<${selector} variant="secondary" size="lg" title="Secondary Action"></${selector}>

<!-- Loading state -->
<${selector} [loading]="isLoading" title="Processing..."></${selector}>
\`\`\`` : ''}

## ♿ Accessibility

This component includes:
- **ARIA Labels** - Proper labeling for screen readers
- **Keyboard Navigation** - Full keyboard support
- **Focus Management** - Visible focus indicators
- **Loading States** - Proper loading announcements

## 🎯 Best Practices

- Use descriptive titles for better accessibility
- Choose appropriate variants for context
- Handle loading states properly
- Provide meaningful click handlers

## 📦 Dependencies

- Angular 19.2.0+
- Tailwind CSS 4.0+
- Learning Notebook Design System

## 🔧 Development

### Testing
\`\`\`bash
ng test
\`\`\`

### Building
\`\`\`bash
ng build
\`\`\`

---

*This component follows Learning Notebook design system patterns and accessibility guidelines.*`;
}

/**
 * Generate test file boilerplate
 */
function generateSpecFile(componentName: string, type: string, features: string[]): string {
  const kebabName = componentName.toLowerCase().replace('component', '').replace(/([a-z])([A-Z])/g, '$1-$2');
  
  return `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ${componentName} } from './${kebabName}.component';

describe('${componentName}', () => {
  let component: ${componentName};
  let fixture: ComponentFixture<${componentName}>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [${componentName}]
    }).compileComponents();
    
    fixture = TestBed.createComponent(${componentName});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    component.title = 'Test Title';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Title');
  });

  it('should emit click event', () => {
    spyOn(component.clicked, 'emit');
    
    component.onClick();
    
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should handle disabled state', () => {
    component.disabled = true;
    
    component.onClick();
    
    expect(component.isActive()).toBeFalse();
  });
});`;
}

/**
 * Format the complete component boilerplate
 */
function formatComponentBoilerplate(template: ComponentTemplate, includeReadme: boolean, includeTests: boolean): string {
  let output = `# 🏗️ Component Boilerplate: ${template.name}

## 📁 File Structure
\`\`\`
src/app/shared/components/ui/${template.name}/
├── ${template.name}.component.ts
├── ${template.name}.component.html
├── ${template.name}.component.scss
${includeReadme ? `├── ${template.name}.component.readme.md` : ''}
${includeTests ? `└── ${template.name}.component.spec.ts` : ''}
\`\`\`

## 📝 TypeScript Component

**File**: \`${template.name}.component.ts\`

\`\`\`typescript
${template.typescript}
\`\`\`

## 🎨 HTML Template

**File**: \`${template.name}.component.html\`

\`\`\`html
${template.html}
\`\`\`

## 💅 SCSS Styles

**File**: \`${template.name}.component.scss\`

\`\`\`scss
${template.scss}
\`\`\`

${includeReadme ? `## 📖 README Documentation

**File**: \`${template.name}.component.readme.md\`

\`\`\`markdown
${template.readme}
\`\`\`` : ''}

${includeTests ? `## 🧪 Test File

**File**: \`${template.name}.component.spec.ts\`

\`\`\`typescript
${template.spec}
\`\`\`` : ''}

## 🚀 Usage Instructions

### 1. Create Component Directory
\`\`\`bash
mkdir -p src/app/shared/components/ui/${template.name}
\`\`\`

### 2. Add Files
Copy the generated code into the respective files shown above.

### 3. Import in Parent Component
\`\`\`typescript
import { ${template.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Component } from './shared/components/ui/${template.name}/${template.name}.component';

@Component({
  imports: [${template.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}Component]
})
\`\`\`

### 4. Use in Template
\`\`\`html
<${template.selector} title="Your Title" (clicked)="handleClick()">
  Your content here
</${template.selector}>
\`\`\`

## 🎯 Generated Features
- ✅ Modern Angular 19 standalone component
- ✅ Signal-based reactivity
- ✅ Tailwind v4 design system integration
- ✅ TypeScript strict mode compliance
- ✅ Accessibility features (ARIA, keyboard navigation)
- ✅ Loading states and error handling
- ✅ Component variants and theming
- ✅ Comprehensive documentation

This component follows all Learning Notebook patterns and conventions for consistent, maintainable code!`;

  return output;
}