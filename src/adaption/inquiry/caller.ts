import { Multiplex } from "../../multiplex/index.js";
import { Id, Req, Res } from "../interfaces/json-rpc.js";
import { RemoteError } from "../interfaces/remote-error.js";
import { GetMethodName } from "../type-functions.js";
import { MethodType } from "./method-types.js";


/**
 * 这只是一个 wrapper 不维护状态，由使用者来确保使用时内部资源处于正常状态。
 */
export class Inquiry<aboutAll extends {}> {
	public constructor(
		private channel: Multiplex.Like<
			Req<'inquire', readonly [string]>,
			Res<MethodType>
		>,
	) { }

	public inquire<
		methodName extends GetMethodName<aboutAll>,
	>(
		methodName: methodName,
	): Promise<MethodType> {
		const id = Id.create();
		const req: Req<'inquire', readonly [string]> = {
			jsonrpc: '2.0',
			id,
			method: 'inquire',
			params: [methodName],
		};
		this.channel.send(req);

		return new Promise((resolve, reject) => {
			const messageListener = (
				res: Res.Succ<MethodType> | Res.Fail,
			) => {
				if (res.id === id) {
					if (typeof res.result !== 'undefined')
						resolve(res.result);
					else
						reject(new RemoteError((<Res.Fail>res).error));
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
