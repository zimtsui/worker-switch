import { __ASSERT } from "../../meta.js";
import { Multiplex } from "../../multiplex/index.js";
import { Req, Res } from "../interfaces/json-rpc.js";
import { Methods as RpcMethods, methodsSym as rpcMethodsSym } from "../rpc/callee/decorators.js";
import { Methods as HandleMethods, methodsSym as handleMethodsSym } from "../handle/callee/decorators.js";
import { MethodType } from "./method-types.js";



export function bind(
	channel: Multiplex.Like<
		Res<MethodType>,
		Req<'inquire', readonly [string]>
	>,
	service: {},
) {
	channel.on('message', (message: Req<any, any>) => {
		let result: MethodType | null;
		if ((<RpcMethods>Reflect.get(service, rpcMethodsSym)).has(message.method))
			result = MethodType.RPC;
		else if (<HandleMethods>Reflect.get(service, handleMethodsSym).has(message.method))
			result = MethodType.HANDLE;
		else result = null;
		if (result !== null)
			channel.send({
				id: message.id,
				jsonrpc: '2.0',
				result,
			});
		else
			channel.send({
				id: message.id,
				jsonrpc: '2.0',
				error: Res.Fail.Error.from(new MethodNotFound()),
			});
	});
}

export class MethodNotFound extends Error { }
