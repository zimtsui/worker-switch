import * as Rpc from '../rpc/callee/bind.js';
import * as Handle from '../handle/callee/bind.js';
import * as Control from '../control/callee.js';
import { Multiplex, ParentProcess as ParentProcessSocket } from "../../multiplex/index.js";
import { Req, Res } from "../interfaces/json-rpc.js";
import { GetMethodName, GetParams, GetResult } from "../type-functions.js";
import { Startable } from '@zimtsui/startable';

export function adapt<
	aboutRpc extends {},
	aboutHandle extends {},
>(
	aboutRpc: aboutRpc,
	aboutHandle: aboutHandle,
	startable: Startable,
) {
	const socket = new ParentProcessSocket(process);
	const controlChannel = new Multiplex(socket, 'control');
	Control.bind(controlChannel, startable);
	Handle.bind('handle', aboutHandle);
	const rpcChannel = new Multiplex<
		Res<GetResult<aboutRpc>>,
		Req<GetMethodName<aboutRpc>, GetParams<aboutRpc>>
	>(socket, 'rpc');
	Rpc.bind(rpcChannel, aboutRpc);
}
