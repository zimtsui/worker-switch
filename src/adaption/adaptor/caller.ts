import { ChildProcess, fork } from "child_process";
import { Server } from "http";
import { createStartable, Startable } from "startable";
import { Multiplex } from "../../multiplex";
import { ChildProcess as ChildProcessSocket } from "../../multiplex";
import { Control } from "../control/caller";
import { Handle } from "../handle/caller";
import { Rpc } from "../rpc/caller";
import { GetMethodName } from "../type-functions";



export type GetProxy<
	rpcPicked extends {},
	handlePicked extends {},
	startableMethodName extends string,
> = rpcPicked &
	handlePicked &
	Omit<
		{
			[name in startableMethodName]: Startable;
		},
		GetMethodName<rpcPicked> | GetMethodName<handlePicked>
	>;

class Adaptor<
	rpcPicked extends {},
	handlePicked extends {},
> {
	public $s = createStartable(
		this.rawStart.bind(this),
		this.rawStop.bind(this),
	);
	public cp?: ChildProcess;
	public socket?: Multiplex.Like<Multiplex.Message<'control' | 'handle' | 'rpc', any>>;
	public control?: Control;
	public rpc?: Rpc<rpcPicked>;
	public handle?: Handle<handlePicked>;

	public constructor(
		public filePath: string,
	) { }

	private async rawStart() {
		this.cp = fork(this.filePath); // TODO 文档参数
		this.socket = new ChildProcessSocket(this.cp);
		this.control = new Control(
			this.cp,
			new Multiplex(this.socket, 'control'),
		);
		await this.control.$s.start(this.$s.stop);
		this.rpc = new Rpc(
			new Multiplex(this.socket, 'rpc'),
		);
		this.handle = new Handle(
			this.cp,
			this.socket,
			'handle',
		);
	}

	private async rawStop() {
		await this.control?.$s.stop();
	}
}

export function create<
	rpcPicked extends {},
	handlePicked extends {},
	startableMethodName extends string,
>(
	filePath: string,
	sendHandleMethodsNames: readonly GetMethodName<handlePicked>[] = [],
	startableMethodName: startableMethodName,
): GetProxy<rpcPicked, handlePicked, startableMethodName> {
	return <any>new Proxy<any>(
		new Adaptor(filePath),
		{
			get(target, field: any): any {
				if (field === startableMethodName) {
					return target.$s;
				} else if ((sendHandleMethodsNames).includes(field)) {
					return (handle: Server, ...args: any[]) => {
						target.$s.assertState();
						return target.handle.sendHandle(
							field,
							args,
							handle,
						);
					}
				} else {
					return (...args: any[]) => {
						target.$s.assertState();
						return target.rpc!.call(field, args);
					}
				}
			}
		},
	);
}
