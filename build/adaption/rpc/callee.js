"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bind = void 0;
const json_rpc_1 = require("../interfaces/json-rpc");
function bind(channel, service) {
    channel.on('message', (message) => {
        const method = Reflect.get(service, message.method, service).bind(service);
        method(...message.params).then(result => channel.send({
            id: message.id,
            jsonrpc: '2.0',
            result,
        }), (err) => channel.send({
            id: message.id,
            jsonrpc: '2.0',
            error: json_rpc_1.Res.Fail.Error.from(err),
        }));
    });
}
exports.bind = bind;
//# sourceMappingURL=callee.js.map