"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Control = void 0;
const assert_1 = __importDefault(require("assert"));
const events_1 = require("events");
const startable_1 = require("startable");
const remote_error_1 = require("../interfaces/remote-error");
class Control {
    constructor(cp, channel) {
        this.cp = cp;
        this.channel = channel;
        this.$s = (0, startable_1.createStartable)(this.rawStart.bind(this), this.rawStop.bind(this));
    }
    async getMessage() {
        const ac = new AbortController();
        await Promise.race([
            (0, events_1.once)(this.channel, 'message', { signal: ac.signal }).then(([res]) => typeof res.error !== 'undefined'
                ? Promise.reject(new remote_error_1.RemoteError(res.error))
                : Promise.resolve()),
            (0, events_1.once)(this.cp, 'exit', { signal: ac.signal }).then(([code, signal]) => Promise.reject(new Control.Exit(code, signal))),
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
            (0, assert_1.default)(this.cp.kill('SIGTERM'));
            await this.getMessage();
        }
    }
}
exports.Control = Control;
(function (Control) {
    class Exit extends Error {
        constructor(code, signal) {
            super();
            this.code = code;
            this.signal = signal;
        }
    }
    Control.Exit = Exit;
})(Control = exports.Control || (exports.Control = {}));
//# sourceMappingURL=caller.js.map