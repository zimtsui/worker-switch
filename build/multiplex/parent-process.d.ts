/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { Serializable } from "child_process";
import EventEmitter from "events";
import { Multiplex } from "./multiplex";
export declare class ObjectSocket<sent extends Serializable, received extends Serializable = sent> extends EventEmitter implements Multiplex.Like<sent, received> {
    private pp;
    constructor(pp: NodeJS.Process);
    private onMessage;
    private onError;
    private onDisconnect;
    send(message: sent): void;
    /**
     * The underlying socket is aggregated rather than composited, and will not be closed.
     */
    close(): void;
}
