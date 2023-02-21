/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { ChildProcess } from "child_process";
import { Server } from "http";
import { Multiplex } from "../../multiplex/index.js";
import { GetParams, GetResult } from "../type-functions.js";
/**
 * 这只是一个 wrapper 不维护状态，由使用者来确保使用时内部资源处于正常状态。
 */
export declare class Handle<aboutHandle extends {}> {
    private cp;
    private channelName;
    private channel;
    constructor(cp: ChildProcess, socket: Multiplex.Like<Multiplex.Message<unknown>>, channelName: string);
    sendHandle<methodName extends string & keyof aboutHandle>(methodName: methodName, params: GetParams<aboutHandle, methodName>, handle: Server): Promise<GetResult<aboutHandle, methodName>>;
}
export declare namespace Handle {
    class InternalChannelClosed extends Error {
    }
}
