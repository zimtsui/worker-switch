import assert from "assert";
import EventEmitter from "events";
export class ObjectSocket extends EventEmitter {
    pp;
    constructor(pp) {
        super();
        this.pp = pp;
        assert(this.pp.send);
        this.pp.on('message', this.onMessage);
        this.pp.on('error', this.onError);
        this.pp.on('disconnect', this.onDisconnect);
    }
    onMessage = (message) => void this.emit('message', message);
    onError = (err) => void this.emit('error', err);
    onDisconnect = () => void this.close();
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
//# sourceMappingURL=parent-process.js.map