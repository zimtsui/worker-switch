import { Mutex } from '@zimtsui/coroutine-locks';
import * as Adaptor from "../adaption/adaptor/caller.js";
export class WorkerPool {
    filePath;
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
}
//# sourceMappingURL=pool.js.map