import { Server } from "http";
import { GetProxy } from "../adaption/adaptor/caller.js";

export interface AboutRpc {
	reload(name: string): Promise<void>;
}

export interface AboutHandle {
	accept(handle: Server): Promise<void>;
}

export type StartableName = '$s';

export type ServiceProxy = GetProxy<AboutRpc, AboutHandle, StartableName>;
