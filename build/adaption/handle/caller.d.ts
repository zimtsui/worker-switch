/// <reference types="node" />
/// <reference types="node" />
import { ChildProcess } from "child_process";
import { Server } from "http";
import { Multiplex } from "../../multiplex";
import { GetParams, GetResult } from "../type-functions";
/**
 * 这只是一个 wrapper 不维护状态，由使用者来确保使用时内部资源处于正常状态。
 */
export declare class Handle<handlePicked extends {}> {
    private cp;
    private channelName;
    private channel;
    constructor(cp: ChildProcess, socket: Multiplex.Like<Multiplex.Message<unknown>>, channelName: string);
    sendHandle<methodName extends string & keyof handlePicked>(methodName: methodName, params: GetParams<handlePicked, methodName>, handle: Server): Promise<GetResult<handlePicked, methodName>>;
}
export declare namespace Handle {
    class InternalChannelClosed extends Error {
    }
}
