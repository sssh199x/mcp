import type { ToolResponse } from '../types/index.js';
export declare function createSearchCodebaseTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            query: {
                type: string;
                description: string;
            };
            fileTypes: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
                default: never[];
            };
            directory: {
                type: string;
                description: string;
                default: string;
            };
            includeContext: {
                type: string;
                description: string;
                default: boolean;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    handler: ({ query, fileTypes, directory, includeContext }: {
        query: string;
        fileTypes?: string[];
        directory?: string;
        includeContext?: boolean;
    }) => Promise<ToolResponse>;
};
//# sourceMappingURL=search-codebase.d.ts.map