"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSocket = void 0;
const events_1 = __importDefault(require("events"));
class ObjectSocket extends events_1.default {
    // private readyState = ReadyState.STARTED;
    constructor(cp) {
        super();
        this.cp = cp;
        this.onMessage = (message) => void this.emit('message', message);
        this.onError = (err) => void this.emit('error', err);
        this.onExit = () => void this.close();
        this.cp.on('message', this.onMessage);
        this.cp.on('error', this.onError);
        this.cp.on('exit', this.onExit);
    }
    send(message) {
        // assert(
        // 	this.readyState === ReadyState.STARTED,
        // 	new StateError(
        // 		this.readyState,
        // 		[ReadyState.STARTED],
        // 	),
        // );
        this.cp.send(message);
    }
    /**
     * The underlying socket is aggregated rather than composited, and will not be closed.
     */
    close() {
        // this.readyState = ReadyState.STOPPED;
        this.cp.off('message', this.onMessage);
        this.cp.off('error', this.onError);
        this.cp.off('close', this.onExit);
        this.emit('close');
    }
}
exports.ObjectSocket = ObjectSocket;
//# sourceMappingURL=child-process.js.map