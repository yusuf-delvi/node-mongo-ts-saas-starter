import { Types } from 'mongoose';
import Country from '../Country/country.types';

export const DOCUMENT_NAME = 'City';
export const COLLECTION_NAME = 'cities';

export default interface City {
	_id: number;
	name: string;
	country: Country | Types.ObjectId;
	state: number;
	createdAt?: Date;
	updatedAt?: Date;
}
