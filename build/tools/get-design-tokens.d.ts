import type { ToolResponse } from '../types/index.js';
export declare function createGetDesignTokensTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            category: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            includeExamples: {
                type: string;
                description: string;
                default: boolean;
            };
            format: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
        };
        required: never[];
        additionalProperties: boolean;
    };
    handler: ({ category, includeExamples, format }: {
        category?: string;
        includeExamples?: boolean;
        format?: string;
    }) => Promise<ToolResponse>;
};
//# sourceMappingURL=get-design-tokens.d.ts.map