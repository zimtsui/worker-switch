export const methodsSym = Symbol();

export type Methods = Map<string, (...args: any[]) => any>;

export function AsMethod(rawName: string): MethodDecorator {
	return (
		proto,
		name,
		propDesc,
	) => {
		if (!Reflect.has(proto, methodsSym))
			Reflect.set(proto, methodsSym, <Methods>new Map());
		const map = <Methods>Reflect.get(proto, methodsSym);

		const method = <(...args: any[]) => any>Reflect.get(proto, name);
		map.set(rawName, method);
	}
}
