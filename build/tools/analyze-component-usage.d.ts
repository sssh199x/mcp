import type { ToolResponse } from '../types/index.js';
export declare function createAnalyzeComponentUsageTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            component: {
                type: string;
                description: string;
                default: string;
            };
            includeContext: {
                type: string;
                description: string;
                default: boolean;
            };
            groupBy: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            showUnused: {
                type: string;
                description: string;
                default: boolean;
            };
        };
        required: never[];
        additionalProperties: boolean;
    };
    handler: ({ component, includeContext, groupBy, showUnused }: {
        component?: string;
        includeContext?: boolean;
        groupBy?: string;
        showUnused?: boolean;
    }) => Promise<ToolResponse>;
};
//# sourceMappingURL=analyze-component-usage.d.ts.map