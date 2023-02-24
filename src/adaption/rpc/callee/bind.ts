import assert from "assert";
import { __ASSERT } from "../../../meta.js";
import { Multiplex } from "../../../multiplex/index.js";
import { Req, Res } from "../../interfaces/json-rpc.js";
import { Methods, methodsSym } from "./decorators.js";



export function bind(
	channel: Multiplex<
		Res<any>,
		Req<any, any>
	>,
	service: {},
) {
	channel.on('message', (message: Req<any, any>) => {
		const methods = <Methods>Reflect.get(service, methodsSym);
		assert(methods.has(message.method));
		const method = methods.get(message.method)!;
		Promise.resolve(method.apply(service, message.params)).then(
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
