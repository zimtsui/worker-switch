import { Startable } from "startable";
import { GetMethodName } from "../type-functions.js";
export type GetProxy<aboutRpc extends {}, aboutHandle extends {}, startableName extends string> = aboutRpc & aboutHandle & Omit<{
    [name in startableName]: Startable;
}, GetMethodName<aboutRpc> | GetMethodName<aboutHandle>>;
export declare function create<aboutRpc extends {}, aboutHandle extends {}, startableName extends string>(filePath: string, methodsNamesAboutHandle: readonly GetMethodName<aboutHandle>[] | undefined, startableMethodName: startableName): GetProxy<aboutRpc, aboutHandle, startableName>;
