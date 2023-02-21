import { __ASSERT } from "../../meta.js";
import { Multiplex } from "../../multiplex/index.js";
import { Req, Res } from "../interfaces/json-rpc.js";
import { GetMethodName, GetParams, GetResult } from "../type-functions.js";



export function bind<aboutRpc extends {}>(
	channel: Multiplex<
		Res<GetResult<aboutRpc>>,
		Req<GetMethodName<aboutRpc>, GetParams<aboutRpc>>
	>,
	service: aboutRpc,
) {
	channel.on('message', (message: Req<any, any>) => {
		const method = (
			<(...args: any[]) => Promise<any>>
			Reflect.get(service, message.method, service)
		).bind(service);
		method(...message.params).then(
			result => channel.send({
				id: message.id,
				jsonrpc: '2.0',
				result,
			}),
			(err: Error) => channel.send({
				id: message.id,
				jsonrpc: '2.0',
				error: Res.Fail.Error.from(err),
			}),
		);
	});
}
