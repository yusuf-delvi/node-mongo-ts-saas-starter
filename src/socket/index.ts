import { Server as SocketIOServer } from 'socket.io';
import JWT from '../core/JWT';
import { validateTokenData } from '../auth/authUtils';

import UserRepo from '../database/User/user.repo';
import KeyStoreRepo from '../database/KeyStore/keystore.repo';
import { Types } from 'mongoose';
import { TokenExpiredError } from 'jsonwebtoken'; // Add import for TokenExpiredError
import { CustomSocket } from '../types/app-request';
import registerStreamEvents from './streamEvents';

export const userSocketMap: {
	[key: string]: string[];
} = {};

const initializeSocketEvents = (io: SocketIOServer): void => {
	io.on('connection', async (socket: CustomSocket) => {
		try {
			const token = socket.handshake.headers['authorization']?.split(' ')[1];

			if (!token) {
				socket.emit('error', { message: 'Token is required' });
				socket.disconnect(true);
				return;
			}

			const payload = await JWT.validate(token, false);

			validateTokenData(payload);

			const user = await UserRepo.findById(new Types.ObjectId(payload.sub));

			if (!user) {
				socket.emit('error', { message: 'unauthorized' });
				socket.disconnect(true);
				return;
			}

			socket.user = user;

			const keystore = await KeyStoreRepo.findforKey(user, payload.prm);

			if (!keystore) {
				socket.emit('error', { message: 'unauthorized' });
				socket.disconnect(true);
				return;
			}

			socket.keystore = keystore;

			if (!userSocketMap[socket.user._id.toString()]) {
				userSocketMap[socket.user._id.toString()] = [];
			}

			userSocketMap[socket.user._id.toString()].push(socket.id);
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				socket.disconnect(true);
			} else {
				socket.disconnect(true);
			}
		}

		registerStreamEvents(socket);

		socket.on('disconnect', () => {
			const disconnectedUserId = Object.keys(userSocketMap).find(
				(userId) => userSocketMap[userId].indexOf(socket.id) !== -1,
			);

			if (disconnectedUserId) {
				userSocketMap[disconnectedUserId] = userSocketMap[
					disconnectedUserId
				].filter((id) => id !== socket.id);
			}

			if (userSocketMap[socket.user._id.toString()].length === 0)
				delete userSocketMap[socket.user._id.toString()];

			console.log(`Client disconnected: ${socket.id}`);
		});
	});
};

export default initializeSocketEvents;
