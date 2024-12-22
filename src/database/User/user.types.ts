import { Types } from 'mongoose';
import Country from '../Country/country.types';
import City from '../City/city.types';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export enum AuthType {
	GOOGLE = 'GOOGLE',
	EMAIL = 'EMAIL',
}

export enum Gender {
	MALE = 'MALE',
	FEMALE = 'FEMALE',
	OTHER = 'OTHER',
}

export interface Address {
	country: Country | Types.ObjectId; // model
	city: City | Types.ObjectId; // model
	street: string;
}

export enum SubscriptionType {
	FREE = 'FREE',
	PROFESSIONAL = 'PROFESSIONAL',
}

export default interface User {
	_id: Types.ObjectId;
	profilePicUrl: string;
	name: string;
	userName: string;
	bio: string;
	phoneNumber: number;
	countryCode: string;
	email: string;
	customerId: string;
	subscription: SubscriptionType;
	isSubscriptionActive: boolean;
	subscriptionId: string;
	age: number;
	gender: Gender;
	address: Address;
	dob?: Date;
	password?: string;
	authType: AuthType;
	verificationToken: {
		token: string | null;
		expiresAt: Date | null;
	} | null;
	isEmailVerified?: boolean;
	isGuideCompleted: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}
