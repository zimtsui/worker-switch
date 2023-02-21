/// <reference types="node" />
/// <reference types="node" />
import { ChildProcess, Serializable } from "child_process";
import EventEmitter from "events";
import { Multiplex } from "./multiplex";
export declare class ObjectSocket<sent extends Serializable, received extends Serializable = sent> extends EventEmitter implements Multiplex.Like<sent, received> {
    private cp;
    constructor(cp: ChildProcess);
    private onMessage;
    private onError;
    private onExit;
    send(message: sent): void;
    /**
     * The underlying socket is aggregated rather than composited, and will not be closed.
     */
    close(): void;
}
