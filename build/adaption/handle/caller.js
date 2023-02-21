"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = void 0;
const multiplex_1 = require("../../multiplex");
// import { Control } from "../control/caller";
const json_rpc_1 = require("../interfaces/json-rpc");
const remote_error_1 = require("../interfaces/remote-error");
/**
 * 这只是一个 wrapper 不维护状态，由使用者来确保使用时内部资源处于正常状态。
 */
class Handle {
    constructor(cp, 
    // 从语义上说，socket 并非多态，因为他并不是「只能传送某一不确定类型」，而是「可以传送各种类型」，因此不用 `any` 而用 `unknown`。
    socket, channelName) {
        this.cp = cp;
        this.channelName = channelName;
        this.channel = new multiplex_1.Multiplex(socket, this.channelName);
    }
    sendHandle(methodName, params, handle) {
        const id = json_rpc_1.Id.create();
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
exports.Handle = Handle;
(function (Handle) {
    class InternalChannelClosed extends Error {
    }
    Handle.InternalChannelClosed = InternalChannelClosed;
})(Handle = exports.Handle || (exports.Handle = {}));
//# sourceMappingURL=caller.js.map