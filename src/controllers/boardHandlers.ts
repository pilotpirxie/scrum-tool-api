import { Socket } from 'socket.io';
import dayjs from 'dayjs';
import Joi from 'joi';
import { IncomingEvents, OutgoingEvents } from '../events';
import { User } from '../models/socket/User';
import Boards from '../models/db/Boards';

const registerBoardHandlers = (socket: Socket<IncomingEvents, OutgoingEvents, {}, User>) => {
  socket.on('SetTimer', async (duration: number) => {
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
        .emit('BoardConfig', { stage: board.stage, timerTo: board.timerTo });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('SetStage', (stage: number) => {
    // search for board
    // set board to stage
    // emit stage set
  });
};

export default registerBoardHandlers;
