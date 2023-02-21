"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adapt = void 0;
const Rpc = __importStar(require("../rpc/callee"));
const Handle = __importStar(require("../handle/callee"));
const Control = __importStar(require("../control/callee"));
const multiplex_1 = require("../../multiplex");
function adapt(rpcPicked, handlePicked, startable) {
    const socket = new multiplex_1.ParentProcess(process);
    const controlChannel = new multiplex_1.Multiplex(socket, 'control');
    Control.bind(controlChannel, startable);
    Handle.bind('handle', handlePicked);
    const rpcChannel = new multiplex_1.Multiplex(socket, 'rpc');
    Rpc.bind(rpcChannel, rpcPicked);
}
exports.adapt = adapt;
//# sourceMappingURL=callee.js.map