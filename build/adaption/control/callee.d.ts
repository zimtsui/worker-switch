import { Startable } from "startable";
import { Multiplex } from "../../multiplex";
import { Res } from "../interfaces/json-rpc";
export declare function bind(channel: Multiplex.Like<Res<null>, never>, startable: Startable): void;
