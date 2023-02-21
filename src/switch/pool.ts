import { AboutHandle, AboutRpc, ServiceProxy, StartableName } from "../worker/intrefaces.js";
import { Mutex } from '@zimtsui/coroutine-locks';
import * as Adaptor from "../adaption/adaptor/caller.js";

export class WorkerPool {
	private mutex = new Mutex(true);
	private buffer?: ServiceProxy;
	public constructor(
		private filePath: string,
	) { }

	public async pop(): Promise<ServiceProxy> {
		await this.mutex.lock();
		const proxy = this.buffer!;
		this.refill();
		return proxy;
	}

	private async refill() {
		this.buffer = Adaptor.create<AboutRpc, AboutHandle, StartableName>(
			this.filePath,
			['accept'],
			'$s',
		);
		await this.buffer.$s.start();
		this.mutex.unlock();
	}
}
