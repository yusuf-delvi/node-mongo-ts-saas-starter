export enum Key {
	USERS = 'USERS',
}

export enum DynamicKey {}

export type DynamicKeyType = `${DynamicKey}_${string}`;

export function getDynamicKey(key: DynamicKey, suffix: string) {
	const dynamic: DynamicKeyType = `${key}_${suffix}`;
	return dynamic;
}
