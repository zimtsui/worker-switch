import { Startable } from "startable";
import { GetMethodName } from "../type-functions.js";
export type GetProxy<rpcPicked extends {}, handlePicked extends {}, startableMethodName extends string> = rpcPicked & handlePicked & Omit<{
    [name in startableMethodName]: Startable;
}, GetMethodName<rpcPicked> | GetMethodName<handlePicked>>;
export declare function create<rpcPicked extends {}, handlePicked extends {}, startableMethodName extends string>(filePath: string, sendHandleMethodsNames: readonly GetMethodName<handlePicked>[] | undefined, startableMethodName: startableMethodName): GetProxy<rpcPicked, handlePicked, startableMethodName>;
