import assert from "assert";
import { once } from "events";
import { createStartable } from "startable";
import { RemoteError } from "../interfaces/remote-error.js";
export class Control {
    cp;
    channel;
    $s = createStartable(this.rawStart.bind(this), this.rawStop.bind(this));
    constructor(cp, channel) {
        this.cp = cp;
        this.channel = channel;
    }
    async getMessage() {
        const ac = new AbortController();
        await Promise.race([
            once(this.channel, 'message', { signal: ac.signal }).then(([res]) => typeof res.error !== 'undefined'
                ? Promise.reject(new RemoteError(res.error))
                : Promise.resolve()),
            once(this.cp, 'exit', { signal: ac.signal }).then(([code, signal]) => Promise.reject(new Control.Exit(code, signal))),
        ]).finally(() => void ac.abort());
    }
    async rawStart() {
        try {
            await this.getMessage();
        }
        finally {
            this.getMessage().then(() => void this.$s.stop(), err => void this.$s.stop(err));
        }
    }
    async rawStop() {
        if (this.cp.exitCode === null) {
            assert(this.cp.kill('SIGTERM'));
            await this.getMessage();
        }
    }
}
(function (Control) {
    class Exit extends Error {
        code;
        signal;
        constructor(code, signal) {
            super();
            this.code = code;
            this.signal = signal;
        }
    }
    Control.Exit = Exit;
})(Control = Control || (Control = {}));
//# sourceMappingURL=caller.js.map