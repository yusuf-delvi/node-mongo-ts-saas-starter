import { model, Schema } from 'mongoose';
import User, {
	AuthType,
	COLLECTION_NAME,
	DOCUMENT_NAME,
	Gender,
	SubscriptionType,
} from './user.types';

const schema = new Schema<User>(
	{
		profilePicUrl: {
			type: Schema.Types.String,
			trim: true,
		},
		name: {
			type: Schema.Types.String,
			trim: true,
			maxlength: 200,
			default: '',
		},
		userName: {
			type: Schema.Types.String,
			trim: true,
			maxlength: 200,
			default: '',
		},
		customerId: {
			type: Schema.Types.String,
			trim: true,
			maxlength: 200,
			default: '',
		},
		subscription: {
			type: Schema.Types.String,
			default: SubscriptionType.FREE,
			enum: Object.values(SubscriptionType),
		},
		subscriptionId: {
			type: Schema.Types.String,
			trim: true,
			maxlength: 200,
			default: '',
		},
		bio: {
			type: Schema.Types.String,
			trim: true,
			maxlength: 200,
			default: '',
		},
		isSubscriptionActive: {
			type: Schema.Types.Boolean,
			default: false,
		},
		phoneNumber: {
			type: Schema.Types.Number,
		},
		countryCode: {
			type: Schema.Types.String,
		},
		email: {
			type: Schema.Types.String,
			trim: true,
			required: true,
			unique: true,
			select: false,
		},
		age: {
			type: Schema.Types.Number,
			required: false,
			default: null,
		},
		authType: {
			type: Schema.Types.String,
			enum: Object.values(AuthType),
			default: AuthType.EMAIL,
		},
		dob: {
			type: Schema.Types.Date,
			required: false,
			default: null,
		},
		gender: {
			type: Schema.Types.String,
			enum: Object.values(Gender),
		},
		address: {
			country: {
				type: Schema.Types.Number,
				ref: 'Country',
			},
			city: {
				type: Schema.Types.Number,
				ref: 'City',
			},
			street: Schema.Types.String,
		},
		password: {
			type: Schema.Types.String,
			select: false,
		},
		verificationToken: {
			token: Schema.Types.String,
			expiresAt: Schema.Types.Date,
		},
		isEmailVerified: {
			type: Schema.Types.Boolean,
			default: false,
		},
		isGuideCompleted: {
			type: Schema.Types.Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

schema.index({ name: 'text', email: 'text', userId: 'text' });
schema.index({ email: 1 });
schema.index({ userId: 1 });

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
