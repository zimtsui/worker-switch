import { $, AsRawStart, AsRawStop } from "@zimtsui/startable";
import assert from "assert";
import { ChildProcess } from "child_process";
import { once } from "events";
import { Multiplex } from "../../multiplex/index.js";
import { Res } from "../interfaces/json-rpc.js";
import { RemoteError } from "../interfaces/remote-error.js";



export class Control {
	public constructor(
		private cp: ChildProcess,
		private channel: Multiplex.Like<never, Res<null>>,
	) { }

	private async getMessage(): Promise<void> {
		const ac = new AbortController();
		await Promise.race([
			(
				<Promise<readonly [Res<null>]>><unknown>
				once(this.channel, 'message', { signal: ac.signal })
			).then(([res]) => typeof res.error !== 'undefined'
				? Promise.reject(new RemoteError(res.error))
				: Promise.resolve(),
			),
			(
				<Promise<readonly [number | null, NodeJS.Signals | null]>><unknown>
				once(this.cp, 'exit', { signal: ac.signal })
			).then(([code, signal]) => Promise.reject(new Control.Exit(code, signal))),
		]).finally(() => void ac.abort());
	}

	@AsRawStart()
	private async rawStart() {
		try {
			await this.getMessage();
		} finally {
			this.getMessage().then(
				() => void $(this).stop(),
				err => void $(this).stop(err),
			);
		}
	}

	@AsRawStop()
	private async rawStop() {
		if (this.cp.exitCode === null) {
			assert(this.cp.kill('SIGTERM'));
			await this.getMessage();
		}
	}
}

export namespace Control {
	export class Exit extends Error {
		public constructor(
			public code: number | null,
			public signal: NodeJS.Signals | null,
		) { super(); }
	}
}
