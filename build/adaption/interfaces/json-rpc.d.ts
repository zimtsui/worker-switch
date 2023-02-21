import * as Generic from "@zimtsui/json-rpc";
export type Id = string;
export declare namespace Id {
    function create(): string;
}
export type Req<method extends string, params extends readonly unknown[]> = Generic.Req<Id, method, params>;
export type Res<result> = Generic.Res<Id, result, Res.Fail.Error.Data>;
export declare namespace Res {
    type Succ<result> = Generic.Res.Succ<Id, result>;
    type Fail = Generic.Res.Fail<Id, Fail.Error.Data>;
    namespace Fail {
        type Error = Generic.Res.Fail.Error<Error.Data>;
        namespace Error {
            interface Data {
                name: string;
                stack?: string;
            }
            function from(err: globalThis.Error): Error;
        }
    }
}
