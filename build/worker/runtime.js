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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runtime = void 0;
const assert_1 = __importDefault(require("assert"));
const startable_1 = require("startable");
class Runtime {
    constructor(specifiers) {
        this.specifiers = specifiers;
        this.$s = (0, startable_1.createStartable)(this.rawStart.bind(this), this.rawStop.bind(this));
        this.mods = new Map();
    }
    getFun(name) {
        const f = this.mods.get(name);
        return f;
    }
    async rawStart() {
        await Promise.all(this.specifiers.map(async (specifier) => {
            var _a;
            const mod = await (_a = specifier, Promise.resolve().then(() => __importStar(require(_a))));
            const f = mod?.default;
            (0, assert_1.default)(typeof f === 'function');
            this.mods.set(specifier, f);
        }));
    }
    async rawStop() { }
}
exports.Runtime = Runtime;
//# sourceMappingURL=runtime.js.map