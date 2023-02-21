import { Multiplex } from "../../multiplex/index.js";
import { Req, Res } from "../interfaces/json-rpc.js";
import { GetMethodName, GetParams, GetResult } from "../type-functions.js";
/**
 * 这只是一个 wrapper 不维护状态，由使用者来确保使用时内部资源处于正常状态。
 */
export declare class Rpc<aboutRpc extends {}> {
    private channel;
    constructor(channel: Multiplex.Like<Req<GetMethodName<aboutRpc>, readonly any[]>, Res<any>>);
    call<methodName extends GetMethodName<aboutRpc>>(methodName: methodName, params: GetParams<aboutRpc, methodName>): Promise<GetResult<aboutRpc, methodName>>;
}
export declare namespace Rpc {
    class InternalChannelClosed extends Error {
    }
}
