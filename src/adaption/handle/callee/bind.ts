import { Req, Res } from "../../interfaces/json-rpc.js";
import { Multiplex, ParentProcess as ParentProcessSocket } from "../../../multiplex/index.js";
import { __ASSERT } from "../../../meta.js";
import { Methods, methodsSym } from "./decorators.js";
import assert from "assert";


export function bind(
	channelName: string,
	daemon: {},
) {
	const socket = new ParentProcessSocket(process);
	const channel = new Multiplex<Res<any>, never>(socket, channelName);
	process.on('message', (message: Multiplex.Message<any>, handle) => {
		if (message.channel === channelName) {
			__ASSERT<Req<string, any>>(message.message);
			const methods = <Methods>Reflect.get(daemon, methodsSym);
			assert(methods.has(message.message.method));
			const method = methods.get(message.message.method)!;
			__ASSERT<(...args: any[]) => Promise<any>>(method);
			method.apply(daemon, [handle, ...message.message.params]).then(
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
