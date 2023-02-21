import { Server } from "http";
import { createStartable } from "startable";
import { ServiceProxy } from "../worker/intrefaces.js";
import { WorkerPool } from "./pool.js";

export class Switch {
	public $s = createStartable(
		this.rawStart.bind(this),
		this.rawStop.bind(this),
	);
	private pool: WorkerPool;
	private worker?: ServiceProxy;

	public constructor(
		filePath: string,
		private server: Server,
	) {
		this.pool = new WorkerPool(filePath);
	}

	public async switch() {
		const newWorker = await this.pool.pop();
		await newWorker.accept(this.server);
		if (this.worker)
			await this.worker.$s.stop();
		this.worker = newWorker;
	}

	private async rawStart() {
		await this.pool.$s.start(this.$s.stop);
		this.worker = await this.pool.pop();
	}

	private async rawStop() {
		if (this.worker) this.worker.$s.stop();
		this.pool.$s.stop();
	}
}
