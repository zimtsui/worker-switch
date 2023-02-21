import EventEmitter from "events";
// import { ReadyState, StateError } from "startable";
export class Multiplex extends EventEmitter {
    socket;
    channelName;
    // private readyState = ReadyState.STARTED;
    constructor(socket, channelName) {
        super();
        this.socket = socket;
        this.channelName = channelName;
        this.socket.on('message', this.onMessage);
        this.socket.on('error', this.onError);
        this.socket.on('close', this.onClose);
    }
    onMessage = (message) => {
        if (message.channel === this.channelName)
            this.emit('message', message.message);
    };
    onError = (err) => void this.emit('error', err);
    onClose = () => void this.close();
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
//# sourceMappingURL=multiplex.js.map