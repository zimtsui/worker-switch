import assert from "assert";
import { createStartable } from "startable";


export type CloudFunction = (...args: any[]) => any | Promise<any>;

export class Runtime {
	public $s = createStartable(
		this.rawStart.bind(this),
		this.rawStop.bind(this),
	);

	private fs = new Map<string, CloudFunction>();

	public constructor(
		private specifiers: string[],
	) { }

	public getFun(name: string): CloudFunction {
		assert(this.fs.has(name));
		const f = this.fs.get(name)!;
		return f;
	}

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

	private async rawStop() { }
}
