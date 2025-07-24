import type { ToolResponse } from '../types/index.js';
export declare function createGenerateComponentBoilerplateTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            name: {
                type: string;
                description: string;
            };
            type: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            features: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
                default: string[];
            };
            includeReadme: {
                type: string;
                description: string;
                default: boolean;
            };
            includeTests: {
                type: string;
                description: string;
                default: boolean;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    handler: ({ name, type, features, includeReadme, includeTests }: {
        name: string;
        type?: string;
        features?: string[];
        includeReadme?: boolean;
        includeTests?: boolean;
    }) => Promise<ToolResponse>;
};
//# sourceMappingURL=generate-component-boilerplate.d.ts.map