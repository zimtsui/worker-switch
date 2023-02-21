import { Multiplex } from "../../multiplex";
import { Req, Res } from "../interfaces/json-rpc";
import { ParentProcess as ParentProcessSocket } from "../../multiplex";
import { __ASSERT } from "../../meta";


export function bind<handlePicked extends {}>(
	channelName: string,
	service: handlePicked,
) {
	const socket = new ParentProcessSocket(process);
	const channel = new Multiplex<Res<any>, never>(socket, channelName);
	process.on('message', (message: Multiplex.Message<any>, handle) => {
		if (message.channel === channelName) {
			__ASSERT<Req<string, any>>(message.message);
			const method = Reflect.get(service, message.message.method, service);
			__ASSERT<(...args: any[]) => Promise<any>>(method);
			method.bind(service)(handle, ...message.message.params).then(
				result => channel.send({
					id: message.message.id,
					jsonrpc: '2.0',
					result,
				}),
				(err: Error) => channel.send({
					id: message.message.id,
					jsonrpc: '2.0',
					error: Res.Fail.Error.from(err),
				}),
			);
		}
	});
}
