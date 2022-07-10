type ConstructorType<T> = new (...args: ConstructorParameters<T>) => T;

type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];
