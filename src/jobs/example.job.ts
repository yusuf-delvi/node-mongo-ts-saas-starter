import cron from 'node-cron';

export const exampleJob = cron.schedule('*/15 * * * *', async () => {
	console.log('Running example job');
	// {
	// 	scheduled: true,
	// 	timezone: 'Your/Timezone',
	// },
});
