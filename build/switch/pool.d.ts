import { ServiceProxy } from "../worker/intrefaces.js";
export declare class WorkerPool {
    private filePath;
    private mutex;
    private buffer?;
    constructor(filePath: string);
    pop(): Promise<ServiceProxy>;
    private refill;
}
