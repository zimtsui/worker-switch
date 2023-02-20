import assert = require("assert");
import EventEmitter = require("events");
// import { ReadyState, StateError } from "startable";


export class Multiplex<
	channel extends string,
	sent,
	received = sent,
> extends EventEmitter implements Multiplex.Like<sent, received> {
	// private readyState = ReadyState.STARTED;
	public constructor(
		protected socket: Multiplex.Like<
			Multiplex.Message<channel>,
			Multiplex.Message<channel>
		>,
		protected channel: channel,
	) {
		super();
		this.socket.on('message', this.onMessage);
		this.socket.on('error', this.onError);
		this.socket.on('close', this.onClose);

	}

	private onMessage = (message: Multiplex.Message<channel>) => {
		if (message.channel === this.channel)
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
			channel: this.channel,
			message: channelMessage,
		});
	}
}

export namespace Multiplex {
	export interface Message<
		channel extends string
	> {
		readonly channel: channel;
		readonly message: any;
	}

	export interface Like<sent, received = sent> extends EventEmitter {
		on<Event extends keyof Like.Events<received>>(event: Event, listener: Like.Events<received>[Event]): this;
		once<Event extends keyof Like.Events<received>>(event: Event, listener: Like.Events<received>[Event]): this;
		off<Event extends keyof Like.Events<received>>(event: Event, listener: Like.Events<received>[Event]): this;
		emit<Event extends keyof Like.Events<received>>(event: Event, ...params: Parameters<Like.Events<received>[Event]>): boolean;

		/**
		 * Calling during the non-STARTED stage causes an undefined consequence.
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
