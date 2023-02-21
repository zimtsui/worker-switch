import { Startable } from "startable";
import { Multiplex } from "../../multiplex/index.js";
import { Res } from "../interfaces/json-rpc.js";


export function bind(
	channel: Multiplex.Like<Res<null>, never>,
	startable: Startable,
) {
	const onSignal = () => startable.stop();
	process.on('SIGTERM', onSignal);
	process.on('SIGINT', onSignal);
	startable.start(err => {
		if (err)
			channel.send({
				id: '',
				jsonrpc: '2.0',
				error: Res.Fail.Error.from(err),
			});
		else
			channel.send({
				id: '',
				jsonrpc: '2.0',
				result: null,
			});
		startable.stop().then(
			() => void channel.send({
				id: '',
				jsonrpc: '2.0',
				result: null,
			}),
			(err: Error) => void channel.send({
				id: '',
				jsonrpc: '2.0',
				error: Res.Fail.Error.from(err),
			}),
		)
	});
}
