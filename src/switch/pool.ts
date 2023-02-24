import { AboutHandle, AboutRpc, ServiceProxy } from "../worker/intrefaces.js";
import { Semque } from '@zimtsui/coroutine-locks';
import * as Adaptor from "../adaption/adaptor/caller.js";
import { $, AsRawStart, AsRawStop } from "@zimtsui/startable";


export class WorkerPool {
	private mutex = new Semque<ServiceProxy>([], 1);
	public constructor(
		private filePath: string,
	) { }

	public async pop(): Promise<ServiceProxy> {
		const proxy = await this.mutex.pop();
		this.refill();
		return proxy;
	}

	private async refill() {
		const proxy = Adaptor.create<AboutRpc, AboutHandle>(
			this.filePath,
		);
		await $(proxy).start();
		this.mutex.push(proxy);
	}

	@AsRawStart()
	private async rawStart() {
		await this.refill();
	}

	@AsRawStop()
	private async rawStop() {
		const proxy = await this.mutex.pop();
		await proxy.$s.stop();
	}
}
