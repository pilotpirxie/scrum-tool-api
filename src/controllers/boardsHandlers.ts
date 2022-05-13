import { Server, Socket } from 'socket.io';
import dayjs from 'dayjs';
import Joi from 'joi';
import { IncomingEvents, OutgoingEvents } from '../events';
import { User } from '../models/socket/User';
import Boards from '../models/db/Boards';

const registerBoardsHandlers = (
  io: Server<IncomingEvents, OutgoingEvents, {}, User>,
  socket: Socket<IncomingEvents, OutgoingEvents, {}, User>,
) => {
  socket.on('SetTimer', async ({ duration }) => {
    try {
      if (Joi.number().allow(60, 120, 180, 300, 600, 900).validate(duration).error) {
        console.error(`SetTimer: Invalid duration: ${duration}`);
        return;
      }

      const board = await Boards.findOneBy({
        id: socket.data.boardId,
      });

      if (!board) {
        console.error(`SetTimer: Board not found: ${socket.data.boardId}`);
        return;
      }

      board.timerTo = dayjs()
        .add(duration, 'seconds').toDate();

      await board.save();

      socket.to(socket.data.boardId || '')
        .emit('BoardConfig', { board: { stage: board.stage, timerTo: board.timerTo.toString() } });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('SetStage', async ({ stage }) => {
    try {
      if (Joi.number().allow(0, 1, 2).validate(stage).error) {
        console.error(`SetStage: Invalid stage: ${stage}`);
        return;
      }

      const board = await Boards.findOneBy({
        id: socket.data.boardId,
      });

      if (!board) {
        console.error(`SetStage: Board not found: ${socket.data.boardId}`);
        return;
      }

      board.stage = stage;

      await board.save();

      socket.to(socket.data.boardId || '')
        .emit('BoardConfig', { board: { stage: board.stage, timerTo: board.timerTo.toString() } });
    } catch (error) {
      console.error(error);
    }
  });
};

export default registerBoardsHandlers;
