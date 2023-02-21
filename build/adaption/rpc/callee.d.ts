import { Multiplex } from "../../multiplex";
import { Req, Res } from "../interfaces/json-rpc";
import { GetMethodName, GetParams, GetResult } from "../type-functions";
export declare function bind<rpcPicked extends {}>(channel: Multiplex<Res<GetResult<rpcPicked>>, Req<GetMethodName<rpcPicked>, GetParams<rpcPicked>>>, service: rpcPicked): void;
