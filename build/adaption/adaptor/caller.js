import { fork } from "child_process";
import { createStartable } from "startable";
import { ChildProcess as ChildProcessSocket, Multiplex } from "../../multiplex/index.js";
import { Control } from "../control/caller.js";
import { Handle } from "../handle/caller.js";
import { Rpc } from "../rpc/caller.js";
class Adaptor {
    filePath;
    $s = createStartable(this.rawStart.bind(this), this.rawStop.bind(this));
    cp;
    socket;
    control;
    rpc;
    handle;
    constructor(filePath) {
        this.filePath = filePath;
    }
    async rawStart() {
        this.cp = fork(this.filePath); // TODO 文档参数
        this.socket = new ChildProcessSocket(this.cp);
        this.control = new Control(this.cp, new Multiplex(this.socket, 'control'));
        await this.control.$s.start(this.$s.stop);
        this.rpc = new Rpc(new Multiplex(this.socket, 'rpc'));
        this.handle = new Handle(this.cp, this.socket, 'handle');
    }
    async rawStop() {
        await this.control?.$s.stop();
    }
}
export function create(filePath, sendHandleMethodsNames = [], startableMethodName) {
    return new Proxy(new Adaptor(filePath), {
        get(target, field) {
            if (field === startableMethodName) {
                return target.$s;
            }
            else if ((sendHandleMethodsNames).includes(field)) {
                return (handle, ...args) => {
                    target.$s.assertState();
                    return target.handle.sendHandle(field, args, handle);
                };
            }
            else {
                return (...args) => {
                    target.$s.assertState();
                    return target.rpc.call(field, args);
                };
            }
        }
    });
}
//# sourceMappingURL=caller.js.map