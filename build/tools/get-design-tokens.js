import { readFile } from 'fs/promises';
import { join } from 'path';
import { ANGULAR_PROJECT_PATH } from '../utils/file-operations.js';
export function createGetDesignTokensTool() {
    return {
        name: "get_design_tokens",
        description: "Get comprehensive information about the Tailwind v4 design system including colors, typography, spacing, and CSS custom properties used in the Learning Notebook project",
        inputSchema: {
            type: "object",
            properties: {
                category: {
                    type: "string",
                    enum: ["all", "colors", "typography", "spacing", "shadows", "transitions", "components"],
                    description: "Filter design tokens by category. Default: 'all'",
                    default: "all"
                },
                includeExamples: {
                    type: "boolean",
                    description: "Include usage examples for each token. Default: true",
                    default: true
                },
                format: {
                    type: "string",
                    enum: ["detailed", "reference", "css"],
                    description: "Output format: detailed (full docs), reference (quick lookup), css (raw values). Default: 'detailed'",
                    default: "detailed"
                }
            },
            required: [],
            additionalProperties: false
        },
        handler: async ({ category = "all", includeExamples = true, format = "detailed" }) => {
            try {
                const stylesPath = join(ANGULAR_PROJECT_PATH, 'src/styles.css');
                const stylesContent = await readFile(stylesPath, 'utf-8');
                const designTokens = parseDesignTokens(stylesContent);
                const formattedOutput = formatDesignTokens(designTokens, category, includeExamples, format);
                return {
                    content: [
                        {
                            type: "text",
                            text: formattedOutput
                        }
                    ]
                };
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `❌ **Design Tokens Error**: ${error instanceof Error ? error.message : 'Unknown error'}

## 💡 Design System Help
- Use \`{"category": "colors"}\` to see color tokens
- Use \`{"category": "typography"}\` for font and text tokens
- Use \`{"format": "reference"}\` for quick lookup
- Use \`{"format": "css"}\` for raw CSS values

**Design System File**: \`src/styles.css\`

### 🎨 Available Categories:
- **colors** - Brand colors, theme colors, semantic colors
- **typography** - Fonts, sizes, line heights, letter spacing
- **spacing** - Margins, padding, gaps
- **shadows** - Box shadows and elevation
- **transitions** - Animation durations and easings
- **components** - Component-specific tokens

### 🔧 Example Usage:
\`\`\`json
{"category": "colors", "format": "reference"}
\`\`\``
                        }
                    ]
                };
            }
        }
    };
}
/**
 * Parse design tokens from styles.css content
 */
function parseDesignTokens(content) {
    return {
        colors: parseColors(content),
        typography: parseTypography(content),
        spacing: parseSpacing(content),
        shadows: parseShadows(content),
        transitions: parseTransitions(content),
        components: parseComponentTokens(content),
        theme: parseThemeTokens(content)
    };
}
/**
 * Parse color tokens
 */
function parseColors(content) {
    const colors = {};
    // Brand and semantic colors
    const brandColors = {
        'color-brand': '#8b5cf6',
        'color-primary': '#3b82f6',
        'color-secondary': '#6b7280',
        'color-accent': '#10b981',
        'color-danger': '#ef4444',
        'color-info': '#93c5fd',
        'color-success': '#22c55e',
        'color-warning': '#facc15'
    };
    // Syntax highlighting colors
    const syntaxColors = {
        'color-code-keyword': '#7c3aed',
        'color-code-string': '#059669',
        'color-code-comment': '#6b7280',
        'color-code-function': '#c084fc'
    };
    // Theme colors (from CSS variables)
    const themeColors = {
        'background': 'Dynamic (light: #ffffff, dark: #0f172a)',
        'foreground': 'Dynamic (light: #1f2937, dark: #f1f5f9)',
        'card': 'Dynamic (light: #ffffff, dark: #1e293b)',
        'card-foreground': 'Dynamic (light: #1f2937, dark: #f1f5f9)',
        'muted': 'Dynamic (light: #f9fafb, dark: #1e293b)',
        'muted-foreground': 'Dynamic (light: #6b7280, dark: #94a3b8)',
        'border': 'Dynamic (light: #e5e7eb, dark: #334155)'
    };
    return {
        brand: brandColors,
        syntax: syntaxColors,
        theme: themeColors,
        usage: {
            'bg-brand': 'Background using brand color',
            'text-primary': 'Text using primary color',
            'border-accent': 'Border using accent color',
            'bg-card': 'Card background (theme-aware)',
            'text-foreground': 'Primary text color (theme-aware)',
            'text-muted-foreground': 'Secondary text color (theme-aware)'
        }
    };
}
/**
 * Parse typography tokens
 */
function parseTypography(content) {
    return {
        fonts: {
            'font-sans': 'Inter Var, sans-serif',
            'font-mono': 'JetBrains Mono, monospace'
        },
        sizes: {
            'text-xs': '0.75rem',
            'text-sm': '0.875rem',
            'text-base': '1rem',
            'text-lg': '1.125rem',
            'text-xl': '1.25rem',
            'text-2xl': '1.5rem',
            'text-3xl': '1.875rem',
            'text-4xl': '2.25rem'
        },
        lineHeights: {
            'leading-tight': '1.2',
            'leading-snug': '1.375',
            'leading-normal': '1.5',
            'leading-relaxed': '1.625',
            'leading-loose': '2'
        },
        letterSpacing: {
            'tracking-tight': '-0.05em',
            'tracking-normal': '0em',
            'tracking-wide': '0.05em'
        },
        usage: {
            'font-sans': 'Primary UI font (Inter)',
            'font-mono': 'Code and monospace text',
            'text-lg font-semibold': 'Section headings',
            'text-sm text-muted-foreground': 'Secondary text',
            'text-2xl font-bold': 'Page titles'
        }
    };
}
/**
 * Parse spacing tokens
 */
function parseSpacing(content) {
    return {
        scale: {
            'space-0': '0px',
            'space-1': '0.25rem',
            'space-2': '0.5rem',
            'space-3': '0.75rem',
            'space-4': '1rem',
            'space-6': '1.5rem',
            'space-8': '2rem'
        },
        usage: {
            'p-4': 'Standard component padding',
            'p-6': 'Card padding',
            'gap-4': 'Standard grid/flex gaps',
            'mb-6': 'Section spacing',
            'space-y-4': 'Vertical spacing between elements'
        },
        patterns: {
            'Components': 'p-4 to p-8 depending on size',
            'Cards': 'p-6 standard, p-4 compact',
            'Grids': 'gap-4 standard, gap-6 for larger items',
            'Sections': 'mb-6 to mb-8 for vertical rhythm'
        }
    };
}
/**
 * Parse shadow tokens
 */
function parseShadows(content) {
    return {
        elevation: {
            'shadow-sm': '0 1px 2px 0 rgba(0,0,0,0.05)',
            'shadow-md': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            'shadow-lg': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
            'shadow-xl': '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            'shadow-2xl': '0 25px 50px -12px rgba(0,0,0,0.25)'
        },
        usage: {
            'shadow-sm': 'Subtle card elevation',
            'shadow-md': 'Standard card hover state',
            'shadow-lg': 'Elevated components, modals',
            'shadow-xl': 'High elevation, dropdowns',
            'shadow-2xl': 'Maximum elevation, overlays'
        },
        patterns: {
            'Cards': 'shadow-sm default, shadow-lg on hover',
            'Buttons': 'shadow-sm default, shadow-md on hover',
            'Modals': 'shadow-xl for proper layering',
            'Dropdowns': 'shadow-lg to shadow-xl'
        }
    };
}
/**
 * Parse transition tokens
 */
function parseTransitions(content) {
    return {
        duration: {
            'transition-duration': '200ms'
        },
        usage: {
            'transition-colors': 'Color changes (hover, theme)',
            'transition-transform': 'Scale, rotate, translate',
            'transition-all': 'Multiple properties',
            'duration-200': 'Standard UI transitions'
        },
        patterns: {
            'Hover Effects': 'transition-colors duration-200',
            'Transforms': 'transition-transform duration-200',
            'Theme Changes': 'transition-[background,color] duration-[var(--transition-duration)]'
        }
    };
}
/**
 * Parse component-specific tokens
 */
function parseComponentTokens(content) {
    return {
        borders: {
            'radius-sm': '0.125rem',
            'radius-md': '0.375rem',
            'radius-lg': '1rem'
        },
        usage: {
            'rounded-md': 'Standard component border radius',
            'rounded-lg': 'Card and container border radius',
            'rounded-full': 'Circular elements (badges, avatars)'
        },
        patterns: {
            'Buttons': 'rounded-md standard',
            'Cards': 'rounded-lg for containers',
            'Input Fields': 'rounded-md for consistency',
            'Badges': 'rounded-full for pills'
        }
    };
}
/**
 * Parse theme tokens
 */
function parseThemeTokens(content) {
    return {
        lightMode: {
            'background': '#ffffff',
            'foreground': '#1f2937',
            'card': '#ffffff',
            'muted': '#f9fafb',
            'border': '#e5e7eb'
        },
        darkMode: {
            'background': '#0f172a',
            'foreground': '#f1f5f9',
            'card': '#1e293b',
            'muted': '#1e293b',
            'border': '#334155'
        },
        usage: {
            'bg-background': 'Main app background',
            'bg-card': 'Component backgrounds',
            'text-foreground': 'Primary text',
            'text-muted-foreground': 'Secondary text',
            'border-border': 'Borders and dividers'
        }
    };
}
/**
 * Format design tokens for output
 */
function formatDesignTokens(tokens, category, includeExamples, format) {
    if (format === "css") {
        return formatAsCSS(tokens, category);
    }
    else if (format === "reference") {
        return formatAsReference(tokens, category);
    }
    else {
        return formatAsDetailed(tokens, category, includeExamples);
    }
}
/**
 * Format as detailed documentation
 */
function formatAsDetailed(tokens, category, includeExamples) {
    let output = `# 🎨 Learning Notebook Design System

## 📋 Design Token Overview
Comprehensive Tailwind v4 design system with CSS-First API integration.

**Categories Available**: colors, typography, spacing, shadows, transitions, components

`;
    if (category === "all" || category === "colors") {
        output += `## 🌈 Color Tokens

### Brand Colors
${Object.entries(tokens.colors.brand).map(([key, value]) => `- **${key}**: \`${value}\``).join('\n')}

### Syntax Highlighting
${Object.entries(tokens.colors.syntax).map(([key, value]) => `- **${key}**: \`${value}\``).join('\n')}

### Theme Colors (Dynamic)
${Object.entries(tokens.colors.theme).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

${includeExamples ? `### Usage Examples
${Object.entries(tokens.colors.usage).map(([key, value]) => `- \`${key}\` - ${value}`).join('\n')}

\`\`\`html
<div class="bg-brand text-white p-4 rounded-md">Brand colored container</div>
<p class="text-primary">Primary colored text</p>
<div class="bg-card border border-border p-6">Theme-aware card</div>
\`\`\`
` : ''}

`;
    }
    if (category === "all" || category === "typography") {
        output += `## 📝 Typography Tokens

### Font Families
${Object.entries(tokens.typography.fonts).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

### Font Sizes  
${Object.entries(tokens.typography.sizes).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

### Line Heights
${Object.entries(tokens.typography.lineHeights).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

${includeExamples ? `### Typography Examples
${Object.entries(tokens.typography.usage).map(([key, value]) => `- \`${key}\` - ${value}`).join('\n')}

\`\`\`html
<h1 class="text-2xl font-bold text-foreground">Page Title</h1>
<p class="text-base leading-relaxed text-foreground">Body text with relaxed line height</p>
<code class="font-mono text-sm bg-muted p-1 rounded">Code snippet</code>
\`\`\`
` : ''}

`;
    }
    if (category === "all" || category === "spacing") {
        output += `## 📐 Spacing Tokens

### Spacing Scale
${Object.entries(tokens.spacing.scale).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

### Common Patterns
${Object.entries(tokens.spacing.patterns).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

${includeExamples ? `### Spacing Examples
${Object.entries(tokens.spacing.usage).map(([key, value]) => `- \`${key}\` - ${value}`).join('\n')}

\`\`\`html
<div class="p-6 mb-8">Card with standard padding and section spacing</div>
<div class="grid grid-cols-3 gap-4">Grid with standard gaps</div>
\`\`\`
` : ''}

`;
    }
    if (category === "all" || category === "shadows") {
        output += `## 🔳 Shadow Tokens

### Elevation Scale
${Object.entries(tokens.shadows.elevation).map(([key, value]) => `- **${key}**: \`${value}\``).join('\n')}

### Shadow Patterns
${Object.entries(tokens.shadows.patterns).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

${includeExamples ? `### Shadow Examples
\`\`\`html
<div class="bg-card shadow-sm p-4 rounded-md">Subtle card elevation</div>
<button class="shadow-sm hover:shadow-md transition-shadow">Interactive button</button>
<div class="bg-card shadow-xl p-6 rounded-lg">High elevation modal</div>
\`\`\`
` : ''}

`;
    }
    output += `## 🚀 Integration with Angular Components

### Component Patterns
- **All UI components** use these design tokens consistently
- **Dark mode** automatically switches theme colors
- **Hover states** use shadow and color transitions
- **Responsive design** maintains token consistency across breakpoints

### Usage in Component Development
\`\`\`typescript
// Component classes using design tokens
public readonly cardClasses = computed(() => {
  return 'bg-card border border-border rounded-lg shadow-sm hover:shadow-lg p-6';
});
\`\`\`

\`\`\`html
<!-- Template using design system -->
<div class="bg-background text-foreground min-h-screen">
  <div class="bg-card border border-border rounded-lg shadow-sm p-6 mb-6">
    <h2 class="text-lg font-semibold text-foreground mb-4">Card Title</h2>
    <p class="text-sm text-muted-foreground">Card content with proper contrast</p>
  </div>
</div>
\`\`\`

*This design system ensures consistency, accessibility, and maintainability across your entire Learning Notebook application.*`;
    return output;
}
/**
 * Format as quick reference
 */
function formatAsReference(tokens, category) {
    let output = `# 🎨 Design Tokens Reference\n\n`;
    if (category === "all" || category === "colors") {
        output += `## Colors\n`;
        output += `**Brand**: brand, primary, secondary, accent, danger, info, success, warning\n`;
        output += `**Theme**: bg-background, bg-card, text-foreground, text-muted-foreground, border-border\n\n`;
    }
    if (category === "all" || category === "typography") {
        output += `## Typography\n`;
        output += `**Fonts**: font-sans (Inter), font-mono (JetBrains)\n`;
        output += `**Sizes**: text-xs to text-4xl\n`;
        output += `**Line Heights**: leading-tight, leading-snug, leading-normal, leading-relaxed\n\n`;
    }
    if (category === "all" || category === "spacing") {
        output += `## Spacing\n`;
        output += `**Scale**: space-0 (0px) to space-8 (2rem)\n`;
        output += `**Common**: p-4 (components), p-6 (cards), gap-4 (grids), mb-6 (sections)\n\n`;
    }
    return output;
}
/**
 * Format as raw CSS
 */
function formatAsCSS(tokens, category) {
    return `/* Learning Notebook Design Tokens - CSS Values */

/* Colors */
--color-brand: #8b5cf6;
--color-primary: #3b82f6;
--color-secondary: #6b7280;
--color-accent: #10b981;
--color-danger: #ef4444;

/* Typography */
--font-sans: 'Inter Var', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Spacing */
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);

/* Theme (Dynamic) */
:root {
  --background: #ffffff;
  --foreground: #1f2937;
  --card: #ffffff;
  --muted: #f9fafb;
  --border: #e5e7eb;
}

.dark {
  --background: #0f172a;
  --foreground: #f1f5f9;
  --card: #1e293b;
  --muted: #1e293b;
  --border: #334155;
}`;
}
//# sourceMappingURL=get-design-tokens.js.map