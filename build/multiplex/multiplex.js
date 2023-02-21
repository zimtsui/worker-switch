"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Multiplex = void 0;
const events_1 = __importDefault(require("events"));
// import { ReadyState, StateError } from "startable";
class Multiplex extends events_1.default {
    // private readyState = ReadyState.STARTED;
    constructor(socket, channelName) {
        super();
        this.socket = socket;
        this.channelName = channelName;
        this.onMessage = (message) => {
            if (message.channel === this.channelName)
                this.emit('message', message.message);
        };
        this.onError = (err) => void this.emit('error', err);
        this.onClose = () => void this.close();
        this.socket.on('message', this.onMessage);
        this.socket.on('error', this.onError);
        this.socket.on('close', this.onClose);
    }
    /**
     * The underlying socket is aggregated rather than composited, and will not be closed.
     */
    close() {
        // this.readyState = ReadyState.STOPPED;
        this.socket.off('message', this.onMessage);
        this.socket.off('error', this.onError);
        this.socket.off('close', this.onClose);
        this.emit('close');
    }
    send(channelMessage) {
        // assert(
        // 	this.readyState === ReadyState.STARTED,
        // 	new StateError(
        // 		this.readyState,
        // 		[ReadyState.STARTED],
        // 	),
        // );
        this.socket.send({
            channel: this.channelName,
            message: channelMessage,
        });
    }
}
exports.Multiplex = Multiplex;
//# sourceMappingURL=multiplex.js.map