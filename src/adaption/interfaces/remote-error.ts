import { Res } from "./json-rpc.js";

export class RemoteError extends Error {
	public code: number;
	public constructor(
		error: Res.Fail.Error,
	) {
		super(error.message);
		this.name = error.data.name;
		this.code = error.code;
		this.stack = error.data.stack;
	}
}
