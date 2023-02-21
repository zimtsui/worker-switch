import { Multiplex } from "../../multiplex/index.js";
import { Id, Req, Res } from "../interfaces/json-rpc.js";
import { RemoteError } from "../interfaces/remote-error.js";
import { GetMethodName, GetParams, GetResult } from "../type-functions.js";


/**
 * 这只是一个 wrapper 不维护状态，由使用者来确保使用时内部资源处于正常状态。
 */
export class Rpc<rpcPicked extends {}> {
	public constructor(
		private channel: Multiplex.Like<
			Req<GetMethodName<rpcPicked>, readonly any[]>,
			Res<any>
		>,
	) { }

	public call<
		methodName extends GetMethodName<rpcPicked>,
	>(
		methodName: methodName,
		params: GetParams<rpcPicked, methodName>,
	): Promise<GetResult<rpcPicked, methodName>> {
		const id = Id.create();
		const req: Req<methodName, GetParams<rpcPicked, methodName>> = {
			jsonrpc: '2.0',
			id,
			method: methodName,
			params,
		};
		this.channel.send(req);

		return new Promise((resolve, reject) => {
			const messageListener = (
				res: Res.Succ<GetResult<rpcPicked, methodName>> | Res.Fail,
			) => {
				if (res.id === id) {
					if (typeof res.result !== 'undefined')
						resolve(res.result);
					else
						reject(new RemoteError(res.error!));
					this.channel.off('message', messageListener);
					this.channel.off('error', errorListener);
					this.channel.off('close', closeListener);
				}
			};
			const errorListener = (err: Error) => {
				reject(err);
				this.channel.off('message', messageListener);
				this.channel.off('error', errorListener);
				this.channel.off('close', closeListener);
			}
			const closeListener = () => {
				reject(new Rpc.InternalChannelClosed());
				this.channel.off('message', messageListener);
				this.channel.off('error', errorListener);
				this.channel.off('close', closeListener);
			}
			this.channel.on('message', messageListener);
			this.channel.on('error', errorListener);
			this.channel.on('close', closeListener);
		});
	}
}

export namespace Rpc {
	export class InternalChannelClosed extends Error { }
}
