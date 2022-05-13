import { Server, Socket } from 'socket.io';
import Joi from 'joi';
import dayjs from 'dayjs';
import { IncomingEvents, OutgoingEvents } from '../events';
import { User } from '../models/socket/User';
import Boards from '../models/db/Boards';
import Users, { getRawUser } from '../models/db/Users';

const registerUserHandlers = (
  io: Server<IncomingEvents, OutgoingEvents, {}, User>,
  socket: Socket<IncomingEvents, OutgoingEvents, {}, User>,
) => {
  socket.on('disconnect', () => {
    console.info('disconnected');
  });

  socket.on('Join', async ({ nickname, boardId }) => {
    try {
      if (Joi.string().allow('').validate(boardId).error) {
        console.error(`Join: Invalid boardId: ${boardId}`);
        return;
      }

      if (Joi.string().validate(nickname).error) {
        console.error(`Join: Invalid nickname: ${nickname}`);
        return;
      }

      let board;
      if (boardId.length !== 0) {
        board = await Boards.findOneBy({
          id: socket.data.boardId,
        });

        if (!board) {
          console.info(`Join: Board not found: ${socket.data.boardId}`);
          return;
        }
      } else {
        board = await Boards.create({
          stage: 0,
          timerTo: dayjs(),
        }).save();
      }

      const user = await Users.create({
        nickname,
        avatar: 0,
        board: {
          id: board.id,
        },
        sid: socket.id,
        isReady: false,
      }).save();

      if (!user) {
        console.error(`Join: User not created: ${socket.data.boardId} ${nickname}`);
        return;
      }

      socket.join(board.id);

      socket.data.userId = user.id;
      socket.data.boardId = board.id;
      socket.data.nickname = user.nickname;

      const users = await Users.find({
        where: {
          board: {
            id: board.id,
          },
        },
      });

      const rawUsers = users.map((tmpUser) => getRawUser(tmpUser));

      io.to(socket.data.boardId)
        .emit('UsersState', { users: rawUsers });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('ToggleReady', async () => {
    try {
      const user = await Users.findOne({
        where: {
          id: socket.data.userId,
        },
      });

      if (!user) {
        console.error(`ToggleReady: User not found: ${socket.data.userId}`);
        return;
      }

      user.isReady = !user.isReady;

      await user.save();

      socket.to(socket.data.boardId || '')
        .emit('UserState', { user: getRawUser(user) });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('ChangeUserData', async ({ nickname, avatar }) => {
    try {
      if (Joi.string().validate(nickname).error) {
        console.error(`ChangeUserData: Invalid nickname: ${nickname}`);
        return;
      }

      if (Joi.number().validate(avatar).error) {
        console.error(`ChangeUserData: Invalid avatar: ${avatar}`);
        return;
      }

      const user = await Users.findOne({
        where: {
          id: socket.data.userId,
        },
      });

      if (!user) {
        console.error(`ChangeUserData: User not found: ${socket.data.userId}`);
        return;
      }

      user.nickname = nickname;
      user.avatar = avatar;

      await user.save();

      socket.to(socket.data.boardId || '')
        .emit('UserState', { user: getRawUser(user) });
    } catch (error) {
      console.error(error);
    }
  });
};

export default registerUserHandlers;
