import { Schema, model } from 'mongoose';
import Sample, {
	Category,
	DOCUMENT_NAME,
	COLLECTION_NAME,
} from './sample.types';

const schema = new Schema<Sample>(
	{
		category: {
			type: Schema.Types.String,
			required: true,
			enum: Object.values(Category),
		},
		status: {
			type: Schema.Types.Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	},
);

export const SampleModel = model<Sample>(
	DOCUMENT_NAME,
	schema,
	COLLECTION_NAME,
);
