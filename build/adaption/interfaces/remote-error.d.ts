import { Res } from "./json-rpc";
export declare class RemoteError extends Error {
    code: number;
    constructor(error: Res.Fail.Error);
}
