/// <reference types="node" />
/// <reference types="node" />
import { ChildProcess } from "child_process";
import { Multiplex } from "../../multiplex";
import { Res } from "../interfaces/json-rpc";
export declare class Control {
    private cp;
    private channel;
    $s: import("startable").Startable;
    constructor(cp: ChildProcess, channel: Multiplex.Like<never, Res<null>>);
    private getMessage;
    private rawStart;
    private rawStop;
}
export declare namespace Control {
    class Exit extends Error {
        code: number | null;
        signal: NodeJS.Signals | null;
        constructor(code: number | null, signal: NodeJS.Signals | null);
    }
}
