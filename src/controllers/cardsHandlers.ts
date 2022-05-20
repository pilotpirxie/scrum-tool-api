import { Server, Socket } from 'socket.io';
import Joi from 'joi';
import { IncomingEvents, OutgoingEvents } from '../events';
import { User } from '../models/socket/User';
import Cards, { getRawCard } from '../models/db/Cards';
import Votes from '../models/db/Votes';
import Boards from '../models/db/Boards';

const registerCardsHandlers = (
  io: Server<IncomingEvents, OutgoingEvents, {}, User>,
  socket: Socket<IncomingEvents, OutgoingEvents, {}, User>,
) => {
  socket.on('CreateCard', async ({ content, column }) => {
    try {
      if (Joi.string().min(1).max(512).validate(content).error) {
        console.error(`CreateCard: Invalid content: ${content}`);
        return;
      }

      if (Joi.number().allow(0, 1, 2).validate(column).error) {
        console.error(`CreateCard: Invalid column: ${column}`);
        return;
      }

      const card = await Cards.create({
        content,
        column,
        board: {
          id: socket.data.boardId,
        },
        user: {
          id: socket.data.userId,
        },
        stackedOn: '',
        votes: [],
      }).save();

      io.to(socket.data.boardId || '')
        .emit('CardState', { card: getRawCard(card) });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('UpdateCard', async ({ cardId, content }) => {
    try {
      if (Joi.string().min(1).max(512).validate(content).error) {
        console.error(`UpdateCard: Invalid content: ${content}`);
        return;
      }

      if (Joi.string().validate(cardId).error) {
        console.error(`UpdateCard: Invalid cardId: ${cardId}`);
        return;
      }

      const card = await Cards.findOne({
        where: {
          id: cardId,
        },
        relations: {
          votes: {
            user: true,
          },
          user: true,
        },
      });

      if (!card) {
        console.error(`UpdateCard: Card not found: ${cardId}`);
        return;
      }

      card.content = content;

      await card.save();

      io.to(socket.data.boardId || '')
        .emit('CardState', { card: getRawCard(card) });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('DeleteCard', async ({ cardId }) => {
    try {
      if (Joi.string().validate(cardId).error) {
        console.error(`DeleteCard: Invalid cardId: ${cardId}`);
        return;
      }

      await Cards.delete({
        id: cardId,
      });

      io.to(socket.data.boardId || '')
        .emit('DeleteCard', { cardId });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('GetCards', async () => {
    try {
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

      socket.emit('CardsState', { cards: rawCards });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('GroupCards', async ({ cardId, stackedOn }) => {
    try {
      if (Joi.string().validate(cardId).error) {
        console.error(`GroupCards: Invalid cardId: ${cardId}`);
        return;
      }

      if (Joi.string().validate(stackedOn).error) {
        console.error(`GroupCards: Invalid stackedOn: ${stackedOn}`);
        return;
      }

      if (cardId === stackedOn) {
        console.error(`GroupCards: CardId and stackedOn are the same: ${cardId}`);
        return;
      }

      const card = await Cards.findOne({
        where: {
          id: cardId,
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

      if (!card) {
        console.error(`GroupCards: Card not found: ${cardId}`);
        return;
      }

      card.stackedOn = stackedOn;

      await card.save();

      io.to(socket.data.boardId || '')
        .emit('CardState', { card: getRawCard(card) });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('UngroupCards', async ({ cardId }) => {
    try {
      if (Joi.string().validate(cardId).error) {
        console.error(`UngroupCards: Invalid cardId: ${cardId}`);
        return;
      }

      const card = await Cards.findOne({
        where: {
          id: cardId,
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

      if (!card) {
        console.error(`UngroupCards: Card not found: ${cardId}`);
        return;
      }

      card.stackedOn = '';

      await card.save();

      io.to(socket.data.boardId || '')
        .emit('CardState', { card: getRawCard(card) });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('UpvoteCard', async ({ cardId }) => {
    try {
      if (Joi.string().validate(cardId).error) {
        console.error(`UpvoteCard: Invalid cardId: ${cardId}`);
        return;
      }

      const board = await Boards.findOne({
        where: {
          id: socket.data.boardId,
        },
      });

      if (!board) {
        console.error(`UpvoteCard: Board not found: ${socket.data.boardId}`);
        return;
      }

      const votesCount = await Votes.count({
        where: {
          user: {
            id: socket.data.userId,
          },
        },
      });

      if (votesCount >= board.maxVotes && board.maxVotes > 0) {
        console.error(`UpvoteCard: User has reached max votes: ${socket.data.userId}`);
        return;
      }

      await Votes.create({
        card: {
          id: cardId,
        },
        user: {
          id: socket.data.userId,
        },
      }).save();

      const card = await Cards.findOne({
        where: {
          id: cardId,
        },
        relations: {
          votes: {
            user: true,
          },
          user: true,
        },
      });

      if (!card) {
        console.error(`UpvoteCard: Card not found: ${cardId}`);
        return;
      }

      io.to(socket.data.boardId || '')
        .emit('CardState', { card: getRawCard(card) });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('DownvoteCard', async ({ cardId }) => {
    try {
      if (Joi.string().validate(cardId).error) {
        console.error(`DownvoteCard: Invalid cardId: ${cardId}`);
        return;
      }

      const vote = await Votes.findOne({
        where: {
          card: {
            id: cardId,
          },
          user: {
            id: socket.data.userId,
          },
        },
      });

      if (!vote) {
        console.error(`DownvoteCard: Vote not found: ${cardId} ${socket.data.userId}`);
        return;
      }

      await vote.remove();

      const card = await Cards.findOne({
        where: {
          id: cardId,
        },
        relations: {
          votes: {
            user: true,
          },
          user: true,
        },
      });

      if (!card) {
        console.error(`DownvoteCard: Card not found: ${cardId}`);
        return;
      }

      io.to(socket.data.boardId || '')
        .emit('CardState', { card: getRawCard(card) });
    } catch (error) {
      console.error(error);
    }
  });
};

export default registerCardsHandlers;
