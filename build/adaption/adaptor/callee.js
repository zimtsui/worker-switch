import * as Rpc from '../rpc/callee.js';
import * as Handle from '../handle/callee.js';
import * as Control from '../control/callee.js';
import { Multiplex, ParentProcess as ParentProcessSocket } from "../../multiplex/index.js";
export function adapt(rpcPicked, handlePicked, startable) {
    const socket = new ParentProcessSocket(process);
    const controlChannel = new Multiplex(socket, 'control');
    Control.bind(controlChannel, startable);
    Handle.bind('handle', handlePicked);
    const rpcChannel = new Multiplex(socket, 'rpc');
    Rpc.bind(rpcChannel, rpcPicked);
}
//# sourceMappingURL=callee.js.map