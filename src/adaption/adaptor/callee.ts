import { Startable } from "startable";
import * as Rpc from '../rpc/callee.js';
import * as Handle from '../handle/callee.js';
import * as Control from '../control/callee.js';
import { Multiplex, ParentProcess as ParentProcessSocket } from "../../multiplex/index.js";
import { Req, Res } from "../interfaces/json-rpc.js";
import { GetMethodName, GetParams, GetResult } from "../type-functions.js";

export function adapt<
	rpcPicked extends {},
	handlePicked extends {},
>(
	rpcPicked: rpcPicked,
	handlePicked: handlePicked,
	startable: Startable,
) {
	const socket = new ParentProcessSocket(process);
	const controlChannel = new Multiplex(socket, 'control');
	Control.bind(controlChannel, startable);
	Handle.bind('handle', handlePicked);
	const rpcChannel = new Multiplex<
		Res<GetResult<rpcPicked>>,
		Req<GetMethodName<rpcPicked>, GetParams<rpcPicked>>
	>(socket, 'rpc');
	Rpc.bind(rpcChannel, rpcPicked);
}
