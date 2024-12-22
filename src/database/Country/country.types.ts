export const DOCUMENT_NAME = 'Country';
export const COLLECTION_NAME = 'countries';

export default interface Country {
	_id: number;
	name: string;
	iso3: string;
	iso2: string;
	phoneCode: string;
	currency: string;
	flag: string;
	flagU: string;
	createdAt?: Date;
	updatedAt?: Date;
}
