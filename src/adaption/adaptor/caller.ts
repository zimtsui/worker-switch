import { ChildProcess, fork } from "child_process";
import { $, AsRawStart, AsRawStop, Startable } from "@zimtsui/startable";
import { ChildProcess as ChildProcessSocket, Multiplex } from "../../multiplex/index.js";
import { Control } from "../control/caller.js";
import { Handle } from "../handle/caller.js";
import { Rpc } from "../rpc/caller.js";
import { Inquiry } from "../inquiry/caller.js";
import { MethodType } from "../inquiry/method-types.js";



export type GetProxy<
	aboutRpc extends {},
	aboutHandle extends {},
> = aboutRpc &
	aboutHandle;

class Adaptor<
	aboutRpc extends {},
	aboutHandle extends {},
> {
	public cp?: ChildProcess;
	public socket?: Multiplex.Like<Multiplex.Message<unknown>>;
	public control?: Control;
	public inquiry?: Inquiry<aboutRpc & aboutHandle>;
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
		this.inquiry = new Inquiry(
			new Multiplex(this.socket, 'inquiry'),
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
>(
	filePath: string,
): GetProxy<aboutRpc, aboutHandle> {
	return <any>new Proxy<any>(
		new Adaptor(filePath),
		{
			get(target: Adaptor<aboutRpc, aboutHandle>, field: any): any {
				return async (...args: any[]) => {
					if (await target.inquiry!.inquire(field) === MethodType.HANDLE) {
						$(target).assertState();
						return target.aboutHandle!.sendHandle(
							field,
							args.slice(1),
							args[0],
						);
					} else {
						$(target).assertState();
						return target.aboutRpc!.call(field, args);
					}
				}
			}
		},
	);
}
