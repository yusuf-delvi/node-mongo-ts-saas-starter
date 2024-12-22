import { Job, Queue, Worker } from 'bullmq';
import { redis } from '../config';
import Logger from '../core/Logger';
import { Types } from 'mongoose';

const connection = {
	host: redis.host,
	port: redis.port,
	password: redis.password,
};

interface ExampleInput {
	userId: Types.ObjectId;
}

const attempts = 3;

const generateExample = new Queue<ExampleInput>('generateExample', {
	connection,
	defaultJobOptions: {
		attempts,
		removeOnComplete: true,
	},
});

const worker = new Worker(
	'generateExample',
	async (job: Job) => {
		const { userId } = job.data as ExampleInput;

		console.log('Example job received', userId);
	},
	{
		connection,
	},
);

worker.on('completed', async (job) => {
	const { userId } = job.data as ExampleInput;

	console.log('worker done', userId);
});

worker.on('failed', async (job, err) => {
	Logger.error(err);

	console.log('worker failed');
});

export const add = async (userId: Types.ObjectId) => {
	await generateExample.add(
		'generateExample',
		{ userId: userId },
		{
			jobId: userId.toString(),
		},
	);
};

export const remove = async (userId: Types.ObjectId) => {
	await generateExample.remove(userId.toString());
};

export default { add, remove };
