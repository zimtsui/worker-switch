import * as Generic from "@zimtsui/json-rpc";
import { v1 as makeUuid } from "uuid";


export type Id = string;
export namespace Id {
	export function create() {
		return makeUuid();
	}
}

export type Req<
	method extends string,
	params extends readonly unknown[],
> = Generic.Req<Id, method, params>;

export type Res<
	// 不 extends Serializable 因为虽然 childProcess.send 不能发送裸的 null，但 null 可以嵌在发送的对象内部。
	result,
> = Generic.Res<Id, result, Res.Fail.Error.Data>;
export namespace Res {
	export type Succ<result> = Generic.Res.Succ<Id, result>;
	export type Fail = Generic.Res.Fail<Id, Fail.Error.Data>;
	export namespace Fail {
		export type Error = Generic.Res.Fail.Error<Error.Data>;
		export namespace Error {
			export interface Data {
				name: string;
				stack?: string;
			}
			export function from(err: globalThis.Error): Error {
				return {
					code: 0,
					message: err.message,
					data: {
						name: err.name,
						stack: err.stack,
					},
				};
			}
		}
	}
}
