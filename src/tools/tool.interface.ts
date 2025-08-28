export interface Tool {
    execute(data: any): Promise<any>;
} 