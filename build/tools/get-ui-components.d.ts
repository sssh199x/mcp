import type { ToolResponse } from '../types/index.js';
export declare function createGetUIComponentsTool(): {
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
            includeExamples: {
                type: string;
                description: string;
                default: boolean;
            };
        };
        required: never[];
        additionalProperties: boolean;
    };
    handler: ({ component, includeExamples }: {
        component?: string;
        includeExamples?: boolean;
    }) => Promise<ToolResponse>;
};
//# sourceMappingURL=get-ui-components.d.ts.map