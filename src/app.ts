import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';
import http from 'http';
import { IncomingEvents, OutgoingEvents } from './events';
import { User } from './models/socket/User';
import registerUserHandlers from './controllers/userHandlers';
import registerCardHandlers from './controllers/cardHandlers';
import registerBoardHandlers from './controllers/boardHandlers';

dotenv.config();
const port = process.env.PORT;
const app: Express = express();
const server = http.createServer(app);

const io = new Server<IncomingEvents, OutgoingEvents, {}, User>();

io.on('connection', (socket: Socket<IncomingEvents, OutgoingEvents, {}, User>) => {
  registerUserHandlers(socket);
  registerCardHandlers(socket);
  registerBoardHandlers(socket);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${port}`);
});
