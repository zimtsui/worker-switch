import { Mutex } from '@zimtsui/coroutine-locks';
import * as Adaptor from "../adaption/adaptor/caller.js";
import { createStartable } from "startable";
export class WorkerPool {
    filePath;
    $s = createStartable(this.rawStart.bind(this), this.rawStop.bind(this));
    mutex = new Mutex(true);
    buffer;
    constructor(filePath) {
        this.filePath = filePath;
    }
    async pop() {
        await this.mutex.lock();
        const proxy = this.buffer;
        this.refill();
        return proxy;
    }
    async refill() {
        this.buffer = Adaptor.create(this.filePath, ['accept'], '$s');
        await this.buffer.$s.start();
        this.mutex.unlock();
    }
    async rawStart() {
        await this.refill();
    }
    async rawStop() {
        await this.mutex.lock();
        const proxy = this.buffer;
        await proxy.$s.stop();
    }
}
//# sourceMappingURL=pool.js.map