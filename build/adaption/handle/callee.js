"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bind = void 0;
const multiplex_1 = require("../../multiplex");
const json_rpc_1 = require("../interfaces/json-rpc");
const multiplex_2 = require("../../multiplex");
const meta_1 = require("../../meta");
function bind(channelName, service) {
    const socket = new multiplex_2.ParentProcess(process);
    const channel = new multiplex_1.Multiplex(socket, channelName);
    process.on('message', (message, handle) => {
        if (message.channel === channelName) {
            (0, meta_1.__ASSERT)(message.message);
            const method = Reflect.get(service, message.message.method, service);
            (0, meta_1.__ASSERT)(method);
            method.bind(service)(handle, ...message.message.params).then(result => channel.send({
                id: message.message.id,
                jsonrpc: '2.0',
                result,
            }), (err) => channel.send({
                id: message.message.id,
                jsonrpc: '2.0',
                error: json_rpc_1.Res.Fail.Error.from(err),
            }));
        }
    });
}
exports.bind = bind;
//# sourceMappingURL=callee.js.map