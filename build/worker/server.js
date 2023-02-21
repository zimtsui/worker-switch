"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const router_1 = __importDefault(require("@koa/router"));
const runtime_1 = require("./runtime");
const runtime = new runtime_1.Runtime([
    './cloud-f1'
]);
const router = new router_1.default();
router.get('/cloud-f1', async (ctx, next) => {
    const f = runtime.getFun('cloud-f1');
    ctx.body = await f(ctx);
    await next();
});
const koa = new koa_1.default();
koa.use(router.routes());
koa.listen(3000);
//# sourceMappingURL=server.js.map