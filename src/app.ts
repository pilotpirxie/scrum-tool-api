import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();
const port = process.env.PORT;
const app: Express = express();
const server = http.createServer(app);

interface ServerToClientEvents {}
interface ClientToServerEvents {}
interface InterServerEvents {}
interface SocketData {}

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

io.on('connection', () => {
  // eslint-disable-next-line no-console
  console.log('connected');
});

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${port}`);
});
