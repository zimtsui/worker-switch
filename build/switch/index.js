import { WorkerPool } from "./pool.js";
export class Switch {
    server;
    pool;
    worker = null;
    constructor(filePath, server) {
        this.server = server;
        this.pool = new WorkerPool(filePath);
    }
    async switch() {
        const newWorker = await this.pool.pop();
        await newWorker.accept(this.server);
        if (this.worker)
            await this.worker.$s.stop();
        this.worker = newWorker;
    }
}
//# sourceMappingURL=index.js.map