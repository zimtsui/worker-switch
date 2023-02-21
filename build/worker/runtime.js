import assert from "assert";
import { createStartable } from "startable";
export class Runtime {
    specifiers;
    $s = createStartable(this.rawStart.bind(this), this.rawStop.bind(this));
    fs = new Map();
    constructor(specifiers) {
        this.specifiers = specifiers;
    }
    getFun(name) {
        assert(this.fs.has(name));
        const f = this.fs.get(name);
        return f;
    }
    async rawStart() {
        await Promise.all(this.specifiers.map(async (specifier) => {
            const mod = await import(specifier);
            console.log(mod);
            const f = mod?.default;
            assert(typeof f === 'function');
            this.fs.set(specifier, f);
        }));
    }
    async rawStop() { }
}
//# sourceMappingURL=runtime.js.map