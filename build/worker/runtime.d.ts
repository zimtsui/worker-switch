export type CloudFunction = (...args: any[]) => any | Promise<any>;
export declare class Runtime {
    private specifiers;
    $s: import("startable").Startable;
    private mods;
    constructor(specifiers: string[]);
    getFun(name: string): CloudFunction;
    private rawStart;
    private rawStop;
}
