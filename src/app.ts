import 'reflect-metadata';
import express, { Express } from 'express';
import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';
import http from 'http';
import path from 'path';
import { IncomingEvents, OutgoingEvents } from './events';
import { User } from './models/socket/User';
import registerUsersHandlers from './controllers/usersHandlers';
import registerCardsHandlers from './controllers/cardsHandlers';
import registerBoardsHandlers from './controllers/boardsHandlers';
import AppDataSource from './models/db/dataSource';

dotenv.config();
const port = process.env.PORT || 3000;
const app: Express = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.get('(/*)?', async (req, res, next) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

AppDataSource.initialize().then(async () => {
  console.info('Database connected');
}).catch((error) => {
  console.error(error);
});

const io = new Server<IncomingEvents, OutgoingEvents, {}, User>(server, {
  transports: ['websocket', 'polling'],
});

io.on('connection', (socket: Socket<IncomingEvents, OutgoingEvents, {}, User>) => {
  registerUsersHandlers(io, socket);
  registerCardsHandlers(io, socket);
  registerBoardsHandlers(io, socket);
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${port}`);
});
