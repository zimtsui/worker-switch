"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rpc = void 0;
const json_rpc_1 = require("../interfaces/json-rpc");
const remote_error_1 = require("../interfaces/remote-error");
/**
 * 这只是一个 wrapper 不维护状态，由使用者来确保使用时内部资源处于正常状态。
 */
class Rpc {
    constructor(channel) {
        this.channel = channel;
    }
    call(methodName, params) {
        const id = json_rpc_1.Id.create();
        const req = {
            jsonrpc: '2.0',
            id,
            method: methodName,
            params,
        };
        this.channel.send(req);
        return new Promise((resolve, reject) => {
            const messageListener = (res) => {
                if (res.id === id) {
                    if (typeof res.result !== 'undefined')
                        resolve(res.result);
                    else
                        reject(new remote_error_1.RemoteError(res.error));
                    this.channel.off('message', messageListener);
                    this.channel.off('error', errorListener);
                    this.channel.off('close', closeListener);
                }
            };
            const errorListener = (err) => {
                reject(err);
                this.channel.off('message', messageListener);
                this.channel.off('error', errorListener);
                this.channel.off('close', closeListener);
            };
            const closeListener = () => {
                reject(new Rpc.InternalChannelClosed());
                this.channel.off('message', messageListener);
                this.channel.off('error', errorListener);
                this.channel.off('close', closeListener);
            };
            this.channel.on('message', messageListener);
            this.channel.on('error', errorListener);
            this.channel.on('close', closeListener);
        });
    }
}
exports.Rpc = Rpc;
(function (Rpc) {
    class InternalChannelClosed extends Error {
    }
    Rpc.InternalChannelClosed = InternalChannelClosed;
})(Rpc = exports.Rpc || (exports.Rpc = {}));
//# sourceMappingURL=caller.js.map