import { __ASSERT } from "../../meta";
import { Multiplex } from "../../multiplex";
import { Req, Res } from "../interfaces/json-rpc";

export function bind<handlePicked extends {}>(
	channel: Multiplex<string, Res<any>, Req<string, any>>,
	service: handlePicked,
) {
	channel.on('message', (message: Req<string, any>) => {
		const method = Reflect.get(service, message.method, service);
		__ASSERT<(...args: any[]) => Promise<any>>(method);
		method.bind(service)(...message.params).then(
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
