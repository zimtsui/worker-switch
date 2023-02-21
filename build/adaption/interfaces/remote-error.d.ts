import { Res } from "./json-rpc.js";
export declare class RemoteError extends Error {
    code: number;
    constructor(error: Res.Fail.Error);
}
