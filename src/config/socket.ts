import initializeSocketEvents from '../socket';

const socketConfig = {
	options: {
		// Any global Socket.IO options go here
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
		},
	},
	init: initializeSocketEvents,
};

export default socketConfig;
