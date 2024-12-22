import _ from 'lodash';
import { CustomSocket } from '../types/app-request';
import { Types } from 'mongoose';
import Logger from '../core/Logger';

const registerStreamEvents = (socket: CustomSocket) => {
	socket.on('join', async (room: string) => {
		try {
			socket.join(room);
		} catch (error) {
			Logger.error(error);
		}
	});

	socket.on('disconnect', () => {
		socket.disconnect(true);
		console.log(`${socket.user.name} has disconnected`);
	});
};

export default registerStreamEvents;
