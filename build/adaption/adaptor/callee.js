import * as Rpc from '../rpc/callee.js';
import * as Handle from '../handle/callee.js';
import * as Control from '../control/callee.js';
import { Multiplex, ParentProcess as ParentProcessSocket } from "../../multiplex/index.js";
export function adapt(aboutRpc, aboutHandle, startable) {
    const socket = new ParentProcessSocket(process);
    const controlChannel = new Multiplex(socket, 'control');
    Control.bind(controlChannel, startable);
    Handle.bind('handle', aboutHandle);
    const rpcChannel = new Multiplex(socket, 'rpc');
    Rpc.bind(rpcChannel, aboutRpc);
}
//# sourceMappingURL=callee.js.map