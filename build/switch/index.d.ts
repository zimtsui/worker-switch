/// <reference types="node" resolution-mode="require"/>
import { Server } from "http";
export declare class Switch {
    private server;
    $s: import("startable").Startable;
    private pool;
    private worker?;
    constructor(filePath: string, server: Server);
    switch(): Promise<void>;
    private rawStart;
    private rawStop;
}
