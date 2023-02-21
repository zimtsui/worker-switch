export type GetMethodName<
	T extends {},
> = string & keyof T;

export type GetMethod<
	T extends {},
	methodName extends GetMethodName<T>,
> = ((...args: any[]) => any) & T[methodName];

export type GetParams<
	T extends {},
	methodName extends GetMethodName<T>,
> = Parameters<GetMethod<T, methodName>>;

export type GetResult<
	T extends {},
	methodName extends GetMethodName<T>,
> = ReturnType<GetMethod<T, methodName>>;
