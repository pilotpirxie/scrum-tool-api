import { Socket } from 'socket.io';
import Joi from 'joi';
import { IncomingEvents, OutgoingEvents } from '../events';
import { User } from '../models/socket/User';
import Boards from '../models/db/Boards';
import Users, { getRawUser } from '../models/db/Users';

const registerUserHandlers = (socket: Socket<IncomingEvents, OutgoingEvents, {}, User>) => {
  socket.on('disconnect', () => {
    console.info('disconnected');
  });

  socket.on('Join', async (boardId: string, nickname: string) => {
    try {
      if (Joi.string().validate(boardId).error) {
        console.error(`Join: Invalid boardId: ${boardId}`);
        return;
      }

      if (Joi.string().validate(nickname).error) {
        console.error(`Join: Invalid nickname: ${nickname}`);
        return;
      }

      const board = await Boards.findOneBy({
        id: socket.data.boardId,
      });

      if (!board) {
        console.error(`Join: Board not found: ${socket.data.boardId}`);
        return;
      }

      const user = await Users.create({
        nickname,
        avatar: 0,
        board,
        sid: socket.id,
      });

      if (!user) {
        console.error(`Join: User not created: ${socket.data.boardId} ${nickname}`);
        return;
      }

      socket.join(boardId);

      socket.data.userId = user.id;
      socket.data.boardId = board.id;
      socket.data.nickname = user.nickname;

      const users = await Users.find({
        where: {
          board: {
            id: boardId,
          },
        },
      });

      const rawUsers = users.map((tmpUser) => getRawUser(tmpUser));

      socket.to(socket.data.boardId || '')
        .emit('UsersState', rawUsers);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('ToggleReady', () => {
    // toggle ready status
    // send ready status to all users in the room
  });

  socket.on('ChangeUserData', (nickname: string, avatarId: number) => {
    // change user data
    // send user data to all users in the room
  });
};

export default registerUserHandlers;
