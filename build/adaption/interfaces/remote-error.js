"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteError = void 0;
class RemoteError extends Error {
    constructor(error) {
        super(error.message);
        this.name = error.data.name;
        this.code = error.code;
        this.stack = error.data.stack;
    }
}
exports.RemoteError = RemoteError;
//# sourceMappingURL=remote-error.js.map