import { Schema, model } from 'mongoose';
import Country, { COLLECTION_NAME, DOCUMENT_NAME } from './country.types';

const schema = new Schema<Country>(
	{
		_id: {
			type: Schema.Types.Number,
			required: true,
		},
		name: {
			type: Schema.Types.String,
			requred: [true, 'Country name is required'],
		},
		iso3: {
			type: Schema.Types.String,
		},
		iso2: {
			type: Schema.Types.String,
		},
		phoneCode: {
			type: Schema.Types.String,
		},
		flag: {
			type: Schema.Types.String,
		},
		flagU: {
			type: Schema.Types.String,
		},
		currency: {
			type: Schema.Types.String,
		},
	},
	{
		timestamps: true,
	},
);

export const CountryModel = model<Country>(
	DOCUMENT_NAME,
	schema,
	COLLECTION_NAME,
);
