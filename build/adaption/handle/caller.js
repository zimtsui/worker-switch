import { Multiplex } from "../../multiplex/index.js";
import { Id } from "../interfaces/json-rpc.js";
import { RemoteError } from "../interfaces/remote-error.js";
/**
 * 这只是一个 wrapper 不维护状态，由使用者来确保使用时内部资源处于正常状态。
 */
export class Handle {
    cp;
    channelName;
    channel;
    constructor(cp, 
    // 从语义上说，socket 并非多态，因为他并不是「只能传送某一不确定类型」，而是「可以传送各种类型」，因此不用 `any` 而用 `unknown`。
    socket, channelName) {
        this.cp = cp;
        this.channelName = channelName;
        this.channel = new Multiplex(socket, this.channelName);
    }
    sendHandle(methodName, params, handle) {
        const id = Id.create();
        const req = {
            channel: this.channelName,
            message: {
                jsonrpc: '2.0',
                id,
                method: methodName,
                params,
            }
        };
        this.cp.send(req, handle);
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
                reject(new Handle.InternalChannelClosed());
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
(function (Handle) {
    class InternalChannelClosed extends Error {
    }
    Handle.InternalChannelClosed = InternalChannelClosed;
})(Handle = Handle || (Handle = {}));
//# sourceMappingURL=caller.js.map