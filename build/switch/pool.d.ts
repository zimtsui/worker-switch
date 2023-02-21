import { ServiceProxy } from "../worker/intrefaces.js";
export declare class WorkerPool {
    private filePath;
    $s: import("startable").Startable;
    private mutex;
    private buffer?;
    constructor(filePath: string);
    pop(): Promise<ServiceProxy>;
    private refill;
    private rawStart;
    private rawStop;
}
