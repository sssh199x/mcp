import type { ToolResponse, AnalysisOptions } from '../types/index.js';
export declare function createAnalyzeArchitectureTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            focusArea: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        required: string[];
    };
    handler: ({ focusArea }: AnalysisOptions) => Promise<ToolResponse>;
};
//# sourceMappingURL=analyze-architecture.d.ts.map