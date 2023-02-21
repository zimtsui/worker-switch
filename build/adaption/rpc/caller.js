import { Id } from "../interfaces/json-rpc.js";
import { RemoteError } from "../interfaces/remote-error.js";
/**
 * 这只是一个 wrapper 不维护状态，由使用者来确保使用时内部资源处于正常状态。
 */
export class Rpc {
    channel;
    constructor(channel) {
        this.channel = channel;
    }
    call(methodName, params) {
        const id = Id.create();
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
                        reject(new RemoteError(res.error));
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
(function (Rpc) {
    class InternalChannelClosed extends Error {
    }
    Rpc.InternalChannelClosed = InternalChannelClosed;
})(Rpc = Rpc || (Rpc = {}));
//# sourceMappingURL=caller.js.map