import { Server } from "http";
import { ServiceProxy } from "../worker/intrefaces.js";
import { WorkerPool } from "./pool.js";

export class Switch {
	private pool: WorkerPool;
	private worker: ServiceProxy | null = null;

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
}
