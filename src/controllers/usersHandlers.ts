import { Server, Socket } from 'socket.io';
import Joi from 'joi';
import dayjs from 'dayjs';
import { IncomingEvents, OutgoingEvents } from '../events';
import { User } from '../models/socket/User';
import Boards from '../models/db/Boards';
import Users, { getRawUser } from '../models/db/Users';
import Cards, { getRawCard } from '../models/db/Cards';

const registerUsersHandlers = (
  io: Server<IncomingEvents, OutgoingEvents, {}, User>,
  socket: Socket<IncomingEvents, OutgoingEvents, {}, User>,
) => {
  socket.on('disconnect', async () => {
    try {
      const user = await Users.findOneBy({
        id: socket.data.userId,
      });

      if (!user) {
        console.error('Disconnect: User not found');
        return;
      }

      user.connected = false;

      await user.save();

      const users = await Users.find({
        where: {
          board: {
            id: socket.data.boardId,
          },
          connected: true,
        },
      });

      const rawUsers = users.map((tmpUser) => getRawUser(tmpUser));

      io.to(socket.data.boardId || '').emit('UsersState', { users: rawUsers });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('Join', async ({ nickname, avatar, boardId }) => {
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
          id: boardId,
        });

        if (!board) {
          console.error(`Join: Board not found: ${boardId}`);
          return;
        }
      } else {
        board = await Boards.create({
          stage: 0,
          maxVotes: 6,
          timerTo: dayjs(),
        }).save();
      }

      const user = await Users.create({
        nickname,
        avatar,
        board: {
          id: board.id,
        },
        sid: socket.id,
        isReady: false,
        connected: true,
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
          connected: true,
        },
      });

      const rawUsers = users.map((tmpUser) => getRawUser(tmpUser));

      const cards = await Cards.find({
        where: {
          board: {
            id: socket.data.boardId,
          },
        },
        relations: {
          votes: {
            user: true,
          },
          user: true,
        },
      });

      const rawCards = cards.map((card) => getRawCard(card));

      socket.emit('Joined', {
        localUser: getRawUser(user),
        users: rawUsers,
        board: {
          id: board.id,
          stage: board.stage,
          maxVotes: board.maxVotes,
          timerTo: (new Date(board.timerTo)).getTime(),
        },
        cards: rawCards,
      });

      io.to(socket.data.boardId || '').emit('UsersState', { users: rawUsers });
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

      io.to(socket.data.boardId || '')
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

      io.to(socket.data.boardId || '')
        .emit('UserState', { user: getRawUser(user) });
    } catch (error) {
      console.error(error);
    }
  });
};

export default registerUsersHandlers;
