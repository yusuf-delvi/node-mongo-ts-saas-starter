import EventEmitter from 'events';
import { Types } from 'mongoose';
import Logger from '../core/Logger';

const eventEmitter = new EventEmitter();

function exampleEvent(userId: Types.ObjectId) {
	eventEmitter.emit('onExampleEvent', userId);
}

eventEmitter.on('onExampleEvent', async (userId: Types.ObjectId) => {
	Logger.info('Example event received', userId);
	console.log('Example event received', userId);
});

export default { exampleEvent };
