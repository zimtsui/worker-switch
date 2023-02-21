import { createStartable } from "startable";
import { WorkerPool } from "./pool.js";
export class Switch {
    server;
    $s = createStartable(this.rawStart.bind(this), this.rawStop.bind(this));
    pool;
    worker;
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
    async rawStart() {
        await this.pool.$s.start(this.$s.stop);
        this.worker = await this.pool.pop();
    }
    async rawStop() {
        if (this.worker)
            this.worker.$s.stop();
        this.pool.$s.stop();
    }
}
//# sourceMappingURL=index.js.map