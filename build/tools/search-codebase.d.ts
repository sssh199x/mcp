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
            };
            directory: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler: ({ query, fileTypes, directory }: {
        query: string;
        fileTypes?: string[];
        directory?: string;
    }) => Promise<ToolResponse>;
};
//# sourceMappingURL=search-codebase.d.ts.map