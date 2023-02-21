/// <reference types="node" resolution-mode="require"/>
import { Server } from "http";
export declare class Switch {
    private server;
    private pool;
    private worker;
    constructor(filePath: string, server: Server);
    switch(): Promise<void>;
}
