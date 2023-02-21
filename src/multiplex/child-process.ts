import { ChildProcess, Serializable } from "child_process";
import EventEmitter from "events";
import { Multiplex } from "./multiplex";


export class ObjectSocket<
	sent extends Serializable,
	received extends Serializable = sent,
> extends EventEmitter implements Multiplex.Like<sent, received> {
	// private readyState = ReadyState.STARTED;
	public constructor(
		private cp: ChildProcess,
	) {
		super();
		this.cp.on('message', this.onMessage);
		this.cp.on('error', this.onError);
		this.cp.on('exit', this.onExit);
	}

	private onMessage = (message: received) => void this.emit('message', message);
	private onError = (err: Error) => void this.emit('error', err);
	private onExit = () => void this.close();

	public send(message: sent): void {
		// assert(
		// 	this.readyState === ReadyState.STARTED,
		// 	new StateError(
		// 		this.readyState,
		// 		[ReadyState.STARTED],
		// 	),
		// );
		this.cp.send(message);
	}

	/**
	 * The underlying socket is aggregated rather than composited, and will not be closed.
	 */
	public close(): void {
		// this.readyState = ReadyState.STOPPED;
		this.cp.off('message', this.onMessage);
		this.cp.off('error', this.onError);
		this.cp.off('close', this.onExit);
		this.emit('close');
	}
}
