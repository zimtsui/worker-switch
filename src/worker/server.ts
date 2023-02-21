import Koa from 'koa';
import Router from '@koa/router';
import { Runtime } from './runtime';

const runtime = new Runtime([
	'./cloud-f1'
]);
const router = new Router();


router.get('/cloud-f1', async (ctx, next) => {
	const f = runtime.getFun('cloud-f1');
	ctx.body = await f(ctx);
	await next();
});

const koa = new Koa();
koa.use(router.routes());
koa.listen(3000);
