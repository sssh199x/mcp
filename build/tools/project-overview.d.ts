import type { ToolResponse } from '../types/index.js';
export declare function createProjectOverviewTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {};
        required: never[];
    };
    handler: () => Promise<ToolResponse>;
};
//# sourceMappingURL=project-overview.d.ts.map