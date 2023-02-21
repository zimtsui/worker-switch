import Koa from 'koa';
import Router from '@koa/router';
import { Runtime } from './runtime.js';

const runtime = new Runtime([
	'../../cloud-f1.mjs'
]);
await runtime.$s.start();
const router = new Router();


router.get('/cloud-f1', async (ctx, next) => {
	const f = runtime.getFun('../../cloud-f1.mjs');
	ctx.body = await f(ctx);
	await next();
});

const koa = new Koa();
koa.use(router.routes());
koa.listen(3000);
