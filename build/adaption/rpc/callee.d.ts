import { Multiplex } from "../../multiplex/index.js";
import { Req, Res } from "../interfaces/json-rpc.js";
import { GetMethodName, GetParams, GetResult } from "../type-functions.js";
export declare function bind<aboutRpc extends {}>(channel: Multiplex<Res<GetResult<aboutRpc>>, Req<GetMethodName<aboutRpc>, GetParams<aboutRpc>>>, service: aboutRpc): void;
