import { Types } from 'mongoose';

export const DOCUMENT_NAME = 'ApiKey';
export const COLLECTION_NAME = 'api_keys';

export enum Permission {
	GENERAL = 'GENERAL',
}

export default interface ApiKey {
	_id: Types.ObjectId;
	key: string;
	version: number;
	permissions: Permission[];
	comments: string[];
	status?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}
