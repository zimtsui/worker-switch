"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bind = void 0;
const json_rpc_1 = require("../interfaces/json-rpc");
function bind(channel, startable) {
    const onSignal = () => startable.stop();
    process.on('SIGTERM', onSignal);
    process.on('SIGINT', onSignal);
    startable.start(err => {
        if (err)
            channel.send({
                id: '',
                jsonrpc: '2.0',
                error: json_rpc_1.Res.Fail.Error.from(err),
            });
        else
            channel.send({
                id: '',
                jsonrpc: '2.0',
                result: null,
            });
        startable.stop().then(() => void channel.send({
            id: '',
            jsonrpc: '2.0',
            result: null,
        }), (err) => void channel.send({
            id: '',
            jsonrpc: '2.0',
            error: json_rpc_1.Res.Fail.Error.from(err),
        }));
    });
}
exports.bind = bind;
//# sourceMappingURL=callee.js.map