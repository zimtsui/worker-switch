"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSocket = void 0;
const assert_1 = __importDefault(require("assert"));
const events_1 = __importDefault(require("events"));
class ObjectSocket extends events_1.default {
    constructor(pp) {
        super();
        this.pp = pp;
        this.onMessage = (message) => void this.emit('message', message);
        this.onError = (err) => void this.emit('error', err);
        this.onDisconnect = () => void this.close();
        (0, assert_1.default)(this.pp.send);
        this.pp.on('message', this.onMessage);
        this.pp.on('error', this.onError);
        this.pp.on('disconnect', this.onDisconnect);
    }
    send(message) {
        this.pp.send(message);
    }
    /**
     * The underlying socket is aggregated rather than composited, and will not be closed.
     */
    close() {
        this.pp.off('message', this.onMessage);
        this.pp.off('error', this.onError);
        this.pp.off('close', this.onDisconnect);
        this.emit('close');
    }
}
exports.ObjectSocket = ObjectSocket;
//# sourceMappingURL=parent-process.js.map