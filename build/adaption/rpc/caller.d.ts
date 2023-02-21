import { Multiplex } from "../../multiplex";
import { Req, Res } from "../interfaces/json-rpc";
import { GetMethodName, GetParams, GetResult } from "../type-functions";
/**
 * 这只是一个 wrapper 不维护状态，由使用者来确保使用时内部资源处于正常状态。
 */
export declare class Rpc<rpcPicked extends {}> {
    private channel;
    constructor(channel: Multiplex.Like<Req<GetMethodName<rpcPicked>, readonly any[]>, Res<any>>);
    call<methodName extends GetMethodName<rpcPicked>>(methodName: methodName, params: GetParams<rpcPicked, methodName>): Promise<GetResult<rpcPicked, methodName>>;
}
export declare namespace Rpc {
    class InternalChannelClosed extends Error {
    }
}
