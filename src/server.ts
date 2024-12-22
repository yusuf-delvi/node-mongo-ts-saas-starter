import Logger from './core/Logger';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { port } from './config';
import app from './app';
import socketConfig from './config/socket';
import './jobs';

const httpServer = createServer(app);
export const io = new SocketIOServer(httpServer, socketConfig.options);

socketConfig.init(io);

httpServer
	.listen(port, () => {
		Logger.info(`server running on port : ${port}`);
	})
	.on('error', (e) => Logger.error(e));
