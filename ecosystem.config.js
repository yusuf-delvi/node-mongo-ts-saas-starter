module.exports = {
	apps: [
		{
			name: 'node-mongo-ts-saas-starter',
			script: 'build/server.js',
			node_args: '-r dotenv/config',
		},
	],
};
