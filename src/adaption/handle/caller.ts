import assert = require("assert");
import { ChildProcess } from "child_process";
import { Server } from "http";
import { Multiplex } from "../../multiplex";
// import { Control } from "../control/caller";
import { Id, Req, Res } from "../interfaces/json-rpc";
import { RemoteError } from "../interfaces/remote-error";
import { GetParams, GetResult } from "../type-functions";


/**
 * 这只是一个 wrapper 不维护状态，由使用者来确保使用时内部资源处于正常状态。
 */
export class Handle<handlePicked extends {}> {
	private channel: Multiplex.Like<never, Res<any>>;
	public constructor(
		private cp: ChildProcess,
		// 从语义上说，socket 并非多态，因为他并不是「只能传送某一不确定类型」，而是「可以传送各种类型」，因此不用 `any` 而用 `unknown`。
		socket: Multiplex.Like<Multiplex.Message<string, unknown>>,
		private channelName: string,
	) {
		this.channel = new Multiplex(socket, this.channelName);
	}

	public sendHandle<
		methodName extends string & keyof handlePicked,
	>(
		methodName: methodName,
		params: GetParams<handlePicked, methodName>,
		handle: Server,
	): Promise<GetResult<handlePicked, methodName>> {

		const id = Id.create();
		const req: Multiplex.Message<string, Req<string, readonly any[]>> = {
			channel: this.channelName,
			message: {
				jsonrpc: '2.0',
				id,
				method: methodName,
				params,
			}
		};
		this.cp.send(req, handle);
		return new Promise((resolve, reject) => {
			const messageListener = (
				res: Res.Succ<GetResult<handlePicked, methodName>> | Res.Fail,
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
				reject(new Handle.InternalChannelClosed());
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

export namespace Handle {
	export class InternalChannelClosed extends Error { }
}
