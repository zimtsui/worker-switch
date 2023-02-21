import { Startable } from "startable";
import * as Rpc from '../rpc/callee';
import * as Handle from '../handle/callee';
import * as Control from '../control/callee';
import { Multiplex, ParentProcess as ParentProcessSocket } from "../../multiplex";
import { Req, Res } from "../interfaces/json-rpc";
import { GetMethodName, GetParams, GetResult } from "../type-functions";

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
