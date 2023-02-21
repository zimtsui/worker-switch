import assert from "assert";
import { Serializable } from "child_process";
import EventEmitter from "events";
import { Multiplex } from "./multiplex";



export class ObjectSocket<
	sent extends Serializable,
	received extends Serializable = sent,
> extends EventEmitter implements Multiplex.Like<sent, received> {
	public constructor(
		private pp: NodeJS.Process,
	) {
		super();
		assert(this.pp.send);
		this.pp.on('message', this.onMessage);
		this.pp.on('error', this.onError);
		this.pp.on('disconnect', this.onDisconnect);
	}

	private onMessage = (message: received) => void this.emit('message', message);
	private onError = (err: Error) => void this.emit('error', err);
	private onDisconnect = () => void this.close();

	public send(message: sent): void {
		this.pp.send!(message);
	}

	/**
	 * The underlying socket is aggregated rather than composited, and will not be closed.
	 */
	public close(): void {
		this.pp.off('message', this.onMessage);
		this.pp.off('error', this.onError);
		this.pp.off('close', this.onDisconnect);
		this.emit('close');
	}
}
