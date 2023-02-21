import { Res } from "../interfaces/json-rpc.js";
import { Multiplex, ParentProcess as ParentProcessSocket } from "../../multiplex/index.js";
import { __ASSERT } from "../../meta.js";
export function bind(channelName, service) {
    const socket = new ParentProcessSocket(process);
    const channel = new Multiplex(socket, channelName);
    process.on('message', (message, handle) => {
        if (message.channel === channelName) {
            __ASSERT(message.message);
            const method = Reflect.get(service, message.message.method, service);
            __ASSERT(method);
            method.bind(service)(handle, ...message.message.params).then(result => channel.send({
                id: message.message.id,
                jsonrpc: '2.0',
                result,
            }), (err) => channel.send({
                id: message.message.id,
                jsonrpc: '2.0',
                error: Res.Fail.Error.from(err),
            }));
        }
    });
}
//# sourceMappingURL=callee.js.map