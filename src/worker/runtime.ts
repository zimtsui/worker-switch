import { AsRawStart } from "@zimtsui/startable";
import assert from "assert";


export type CloudFunction = (...args: any[]) => any | Promise<any>;

export class Runtime {
	private fs = new Map<string, CloudFunction>();

	public constructor(
		private specifiers: string[],
	) { }

	public getFun(name: string): CloudFunction {
		assert(this.fs.has(name));
		const f = this.fs.get(name)!;
		return f;
	}

	@AsRawStart()
	private async rawStart() {
		await Promise.all(
			this.specifiers.map(async specifier => {
				const mod = await import(specifier);
				console.log(mod);
				const f = mod?.default;
				assert(typeof f === 'function');
				this.fs.set(specifier, <CloudFunction>f);
			}),
		);
	}
}
