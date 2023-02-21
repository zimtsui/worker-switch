import { __ASSERT } from "../../meta";
import { Multiplex } from "../../multiplex";
import { Req, Res } from "../interfaces/json-rpc";
import { GetMethodName, GetParams, GetResult } from "../type-functions";



export function bind<rpcPicked extends {}>(
	channel: Multiplex<
		Res<GetResult<rpcPicked>>,
		Req<GetMethodName<rpcPicked>, GetParams<rpcPicked>>
	>,
	service: rpcPicked,
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
