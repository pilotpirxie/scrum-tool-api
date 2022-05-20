import { Server, Socket } from 'socket.io';
import dayjs from 'dayjs';
import Joi from 'joi';
import { IncomingEvents, OutgoingEvents } from '../events';
import { User } from '../models/socket/User';
import Boards from '../models/db/Boards';
import Users, { getRawUser } from '../models/db/Users';

const registerBoardsHandlers = (
  io: Server<IncomingEvents, OutgoingEvents, {}, User>,
  socket: Socket<IncomingEvents, OutgoingEvents, {}, User>,
) => {
  socket.on('SetTimer', async ({ duration }) => {
    try {
      if (Joi.number().allow(0, 60, 120, 180, 300, 600, 900).validate(duration).error) {
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

      io.to(socket.data.boardId || '')
        .emit('BoardConfig', {
          board: {
            stage: board.stage,
            timerTo: (new Date(board.timerTo)).getTime(),
            maxVotes: board.maxVotes,
          },
        });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('SetMaxVotes', async ({ maxVotes }) => {
    try {
      if (Joi.number().min(0).max(30).validate(maxVotes).error) {
        console.error(`SetMaxVotes: Invalid maxVotes: ${maxVotes}`);
        return;
      }

      const board = await Boards.findOneBy({
        id: socket.data.boardId,
      });

      if (!board) {
        console.error(`SetMaxVotes: Board not found: ${socket.data.boardId}`);
        return;
      }

      board.maxVotes = maxVotes;

      await board.save();

      io.to(socket.data.boardId || '')
        .emit('BoardConfig', {
          board: {
            stage: board.stage,
            timerTo: (new Date(board.timerTo)).getTime(),
            maxVotes: board.maxVotes,
          },
        });
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
      board.timerTo = dayjs().toDate();

      await board.save();

      await Users.update({
        board: {
          id: socket.data.boardId,
        },
      }, {
        isReady: false,
      });

      const users = await Users.find({
        where: {
          board: {
            id: board.id,
          },
          connected: true,
        },
      });

      const rawUsers = users.map((tmpUser) => getRawUser(tmpUser));

      io.to(socket.data.boardId || '').emit('UsersState', { users: rawUsers });

      io.to(socket.data.boardId || '')
        .emit('BoardConfig', {
          board: {
            stage: board.stage,
            timerTo: (new Date(board.timerTo)).getTime(),
            maxVotes: board.maxVotes,
          },
        });
    } catch (error) {
      console.error(error);
    }
  });
};

export default registerBoardsHandlers;
