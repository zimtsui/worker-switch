export class RemoteError extends Error {
    code;
    constructor(error) {
        super(error.message);
        this.name = error.data.name;
        this.code = error.code;
        this.stack = error.data.stack;
    }
}
//# sourceMappingURL=remote-error.js.map