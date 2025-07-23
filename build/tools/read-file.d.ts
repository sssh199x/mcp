import type { ToolResponse } from '../types/index.js';
export declare function createReadFileTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            filePath: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler: ({ filePath }: {
        filePath: string;
    }) => Promise<ToolResponse>;
};
//# sourceMappingURL=read-file.d.ts.map