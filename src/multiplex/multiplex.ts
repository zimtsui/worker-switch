import assert = require("assert");
import EventEmitter = require("events");
// import { ReadyState, StateError } from "startable";


export class Multiplex<
	// channelName extends string,
	sent,
	received = sent,
> extends EventEmitter implements Multiplex.Like<sent, received> {
	// private readyState = ReadyState.STARTED;
	public constructor(
		private socket: Multiplex.Like<Multiplex.Message<unknown>>,
		private channelName: string,
	) {
		super();
		this.socket.on('message', this.onMessage);
		this.socket.on('error', this.onError);
		this.socket.on('close', this.onClose);

	}

	private onMessage = (message: Multiplex.Message<received>) => {
		if (message.channel === this.channelName)
			this.emit('message', <received>message.message);
	}
	private onError = (err: Error) => void this.emit('error', err);
	private onClose = () => void this.close();

	/**
	 * The underlying socket is aggregated rather than composited, and will not be closed.
	 */
	public close(): void {
		// this.readyState = ReadyState.STOPPED;
		this.socket.off('message', this.onMessage);
		this.socket.off('error', this.onError);
		this.socket.off('close', this.onClose);
		this.emit('close');
	}

	public send(channelMessage: sent): void {
		// assert(
		// 	this.readyState === ReadyState.STARTED,
		// 	new StateError(
		// 		this.readyState,
		// 		[ReadyState.STARTED],
		// 	),
		// );
		this.socket.send({
			channel: this.channelName,
			message: channelMessage,
		});
	}
}

export namespace Multiplex {
	export interface Message<
		// channelName extends string,
		message,
	> {
		readonly channel: string;
		readonly message: message;
	}

	export interface Like<sent, received = sent> extends EventEmitter {
		on<Event extends keyof Like.Events<received>>(event: Event, listener: Like.Events<received>[Event]): this;
		once<Event extends keyof Like.Events<received>>(event: Event, listener: Like.Events<received>[Event]): this;
		off<Event extends keyof Like.Events<received>>(event: Event, listener: Like.Events<received>[Event]): this;
		emit<Event extends keyof Like.Events<received>>(event: Event, ...params: Parameters<Like.Events<received>[Event]>): boolean;

		/**
		 * Calling after 'close' event causes an undefined consequence.
		 */
		send(message: sent): void;
		close(): void;
	}

	export namespace Like {
		export interface Events<received> {
			message(message: received): void;
			error(err: Error): void;
			close(): void;
		}
	}

}
