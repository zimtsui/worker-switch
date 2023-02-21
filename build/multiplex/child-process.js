import EventEmitter from "events";
export class ObjectSocket extends EventEmitter {
    cp;
    // private readyState = ReadyState.STARTED;
    constructor(cp) {
        super();
        this.cp = cp;
        this.cp.on('message', this.onMessage);
        this.cp.on('error', this.onError);
        this.cp.on('exit', this.onExit);
    }
    onMessage = (message) => void this.emit('message', message);
    onError = (err) => void this.emit('error', err);
    onExit = () => void this.close();
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
//# sourceMappingURL=child-process.js.map