import { Request } from 'express';
import { Socket } from 'socket.io';
import User from '../database/User/user.types';
import ApiKey from '../database/ApiKey/apikey.types';
import Keystore from '../database/KeyStore/keystore.types';

declare interface PublicRequest extends Request {
	apiKey: ApiKey;
}

declare interface RoleRequest extends PublicRequest {
	currentRoleCodes: string[];
}

declare interface ProtectedRequest extends RoleRequest {
	user: User;
	accessToken: string;
	keystore: Keystore;
}

declare interface Tokens {
	accessToken: string;
	refreshToken: string;
}

declare interface CustomSocket extends Socket {
	user: User;
	accessToken: string;
	keystore: Keystore;
}
