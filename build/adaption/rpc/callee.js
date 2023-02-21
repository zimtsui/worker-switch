import { Res } from "../interfaces/json-rpc.js";
export function bind(channel, service) {
    channel.on('message', (message) => {
        const method = Reflect.get(service, message.method, service).bind(service);
        method(...message.params).then(result => channel.send({
            id: message.id,
            jsonrpc: '2.0',
            result,
        }), (err) => channel.send({
            id: message.id,
            jsonrpc: '2.0',
            error: Res.Fail.Error.from(err),
        }));
    });
}
//# sourceMappingURL=callee.js.map