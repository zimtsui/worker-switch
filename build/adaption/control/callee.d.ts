import { Startable } from "startable";
import { Multiplex } from "../../multiplex/index.js";
import { Res } from "../interfaces/json-rpc.js";
export declare function bind(channel: Multiplex.Like<Res<null>, never>, startable: Startable): void;
