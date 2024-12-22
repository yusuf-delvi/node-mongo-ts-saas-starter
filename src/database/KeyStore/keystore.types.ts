import { Types } from 'mongoose';
import User from '../User/user.types';

export const DOCUMENT_NAME = 'Keystore';
export const COLLECTION_NAME = 'keystores';

export default interface Keystore {
	_id: Types.ObjectId;
	client: User;
	primaryKey: string;
	secondaryKey: string;
	status?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}
