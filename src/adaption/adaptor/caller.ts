import { ChildProcess, fork } from "child_process";
import { Server } from "http";
import { $, AsRawStart, AsRawStop, Startable } from "@zimtsui/startable";
import { ChildProcess as ChildProcessSocket, Multiplex } from "../../multiplex/index.js";
import { Control } from "../control/caller.js";
import { Handle } from "../handle/caller.js";
import { Rpc } from "../rpc/caller.js";
import { GetMethodName } from "../type-functions.js";



export type GetProxy<
	aboutRpc extends {},
	aboutHandle extends {},
	startableName extends string,
> = aboutRpc &
	aboutHandle &
	Omit<
		{
			[name in startableName]: Startable;
		},
		GetMethodName<aboutRpc> | GetMethodName<aboutHandle>
	>;

class Adaptor<
	aboutRpc extends {},
	aboutHandle extends {},
> {
	public cp?: ChildProcess;
	public socket?: Multiplex.Like<Multiplex.Message<unknown>>;
	public control?: Control;
	public aboutRpc?: Rpc<aboutRpc>;
	public aboutHandle?: Handle<aboutHandle>;

	public constructor(
		public filePath: string,
	) { }

	@AsRawStart()
	private async rawStart() {
		this.cp = fork(this.filePath); // TODO 文档参数
		this.socket = new ChildProcessSocket(this.cp);
		this.control = new Control(
			this.cp,
			new Multiplex(this.socket, 'control'),
		);
		await $(this.control).start($(this).stop);
		this.aboutRpc = new Rpc(
			new Multiplex(this.socket, 'rpc'),
		);
		this.aboutHandle = new Handle(
			this.cp,
			this.socket,
			'handle',
		);
	}

	@AsRawStop()
	private async rawStop() {
		if (this.control)
			await $(this.control).stop();
	}
}

export function create<
	aboutRpc extends {},
	aboutHandle extends {},
	startableName extends string,
>(
	filePath: string,
	methodsNamesAboutHandle: readonly GetMethodName<aboutHandle>[] = [],
	startableMethodName: startableName,
): GetProxy<aboutRpc, aboutHandle, startableName> {
	return <any>new Proxy<any>(
		new Adaptor(filePath),
		{
			get(target, field: any): any {
				if (field === startableMethodName) {
					return target.$s;
				} else if ((methodsNamesAboutHandle).includes(field)) {
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
