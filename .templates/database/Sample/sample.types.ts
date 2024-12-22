import { Types } from 'mongoose';

export const DOCUMENT_NAME = 'Sample';
export const COLLECTION_NAME = 'samples';

export enum Category {
	ABC = 'ABC',
	XYZ = 'XYZ',
}

export default interface Sample {
	_id: Types.ObjectId;
	category: Category;
	status?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}
