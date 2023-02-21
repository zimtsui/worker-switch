import { Multiplex } from "../../multiplex/index.js";
import { Req, Res } from "../interfaces/json-rpc.js";
import { GetMethodName, GetParams, GetResult } from "../type-functions.js";
export declare function bind<rpcPicked extends {}>(channel: Multiplex<Res<GetResult<rpcPicked>>, Req<GetMethodName<rpcPicked>, GetParams<rpcPicked>>>, service: rpcPicked): void;
