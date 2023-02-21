"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const child_process_1 = require("child_process");
const startable_1 = require("startable");
const multiplex_1 = require("../../multiplex");
const multiplex_2 = require("../../multiplex");
const caller_1 = require("../control/caller");
const caller_2 = require("../handle/caller");
const caller_3 = require("../rpc/caller");
class Adaptor {
    constructor(filePath) {
        this.filePath = filePath;
        this.$s = (0, startable_1.createStartable)(this.rawStart.bind(this), this.rawStop.bind(this));
    }
    async rawStart() {
        this.cp = (0, child_process_1.fork)(this.filePath); // TODO 文档参数
        this.socket = new multiplex_2.ChildProcess(this.cp);
        this.control = new caller_1.Control(this.cp, new multiplex_1.Multiplex(this.socket, 'control'));
        await this.control.$s.start(this.$s.stop);
        this.rpc = new caller_3.Rpc(new multiplex_1.Multiplex(this.socket, 'rpc'));
        this.handle = new caller_2.Handle(this.cp, this.socket, 'handle');
    }
    async rawStop() {
        await this.control?.$s.stop();
    }
}
function create(filePath, sendHandleMethodsNames = [], startableMethodName) {
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
exports.create = create;
//# sourceMappingURL=caller.js.map