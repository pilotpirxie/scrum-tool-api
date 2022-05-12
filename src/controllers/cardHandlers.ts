import { Server, Socket } from 'socket.io';
import Joi from 'joi';
import { IncomingEvents, OutgoingEvents } from '../events';
import { User } from '../models/socket/User';
import Cards, { getRawCard } from '../models/db/Cards';
import Votes from '../models/db/Votes';

const registerCardHandlers = (
  io: Server<IncomingEvents, OutgoingEvents, {}, User>,
  socket: Socket<IncomingEvents, OutgoingEvents, {}, User>,
) => {
  socket.on('CreateCard', async (content: string, column: number) => {
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
      });

      socket.to(socket.data.boardId || '')
        .emit('CardState', getRawCard(card));
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('UpdateCard', async (cardId: string, content: string) => {
    try {
      if (Joi.string().min(1).max(512).validate(content).error) {
        console.error(`UpdateCard: Invalid content: ${content}`);
        return;
      }

      if (Joi.string().validate(cardId).error) {
        console.error(`UpdateCard: Invalid cardId: ${cardId}`);
        return;
      }

      const card = await Cards.findOneBy({
        id: cardId,
      });

      if (!card) {
        console.error(`UpdateCard: Card not found: ${cardId}`);
        return;
      }

      card.content = content;

      await card.save();

      socket.to(socket.data.boardId || '')
        .emit('CardState', getRawCard(card));
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('DeleteCard', async (cardId: string) => {
    try {
      if (Joi.string().validate(cardId).error) {
        console.error(`DeleteCard: Invalid cardId: ${cardId}`);
        return;
      }

      await Cards.delete({
        id: cardId,
      });

      socket.to(socket.data.boardId || '')
        .emit('DeleteCard', cardId);
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
      });

      const rawCards = cards.map((card) => getRawCard(card));

      socket.emit('CardsState', rawCards);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('GroupCards', async (cardId: string, stackedOn: string) => {
    try {
      if (Joi.string().validate(cardId).error) {
        console.error(`GroupCards: Invalid cardId: ${cardId}`);
        return;
      }

      if (Joi.string().validate(stackedOn).error) {
        console.error(`GroupCards: Invalid stackedOn: ${stackedOn}`);
        return;
      }

      const card = await Cards.findOneBy({
        id: cardId,
      });

      if (!card) {
        console.error(`GroupCards: Card not found: ${cardId}`);
        return;
      }

      card.stackedOn = stackedOn;

      await card.save();

      socket.to(socket.data.boardId || '')
        .emit('CardState', getRawCard(card));
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('UngroupCards', async (cardId: string) => {
    try {
      if (Joi.string().validate(cardId).error) {
        console.error(`UngroupCards: Invalid cardId: ${cardId}`);
        return;
      }

      const card = await Cards.findOneBy({
        id: cardId,
      });

      if (!card) {
        console.error(`UngroupCards: Card not found: ${cardId}`);
        return;
      }

      card.stackedOn = '';

      await card.save();

      socket.to(socket.data.boardId || '')
        .emit('CardState', getRawCard(card));
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('UpvoteCard', async (cardId: string) => {
    try {
      if (Joi.string().validate(cardId).error) {
        console.error(`UpvoteCard: Invalid cardId: ${cardId}`);
        return;
      }

      await Votes.create({
        card: {
          id: cardId,
        },
        user: {
          id: socket.data.userId,
        },
      });

      const card = await Cards.findOneBy({
        id: cardId,
      });

      if (!card) {
        console.error(`UpvoteCard: Card not found: ${cardId}`);
        return;
      }

      socket.to(socket.data.boardId || '')
        .emit('CardState', getRawCard(card));
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('DownvoteCard', async (cardId: string) => {
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
        },
      });

      if (!vote) {
        console.error(`DownvoteCard: Vote not found: ${cardId}`);
        return;
      }

      await vote.remove();

      const card = await Cards.findOneBy({
        id: cardId,
      });

      if (!card) {
        console.error(`DownvoteCard: Card not found: ${cardId}`);
        return;
      }

      socket.to(socket.data.boardId || '')
        .emit('CardState', getRawCard(card));
    } catch (error) {
      console.error(error);
    }
  });
};

export default registerCardHandlers;
