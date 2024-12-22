import { Schema, model } from 'mongoose';
import City, { COLLECTION_NAME, DOCUMENT_NAME } from './city.types';

const schema = new Schema<City>(
	{
		_id: {
			type: Schema.Types.Number,
			required: true,
		},
		name: {
			type: Schema.Types.String,
			required: [true, 'City name is required'],
		},
		country: {
			type: Schema.Types.Number,
			ref: 'Country',
			required: [true, 'country is required'],
		},
		state: {
			type: Schema.Types.Number,
			// ref to state model
		},
	},
	{
		timestamps: true,
	},
);

export const CityModel = model<City>(DOCUMENT_NAME, schema, COLLECTION_NAME);
