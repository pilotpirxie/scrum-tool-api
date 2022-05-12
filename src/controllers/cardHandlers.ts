import { Socket } from 'socket.io';
import Joi from 'joi';
import { IncomingEvents, OutgoingEvents } from '../events';
import { User } from '../models/socket/User';
import Boards from '../models/db/Boards';
import Cards, { getRawObject } from '../models/db/Cards';
import Users from '../models/db/Users';

const registerCardHandlers = (socket: Socket<IncomingEvents, OutgoingEvents, {}, User>) => {
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

      const board = await Boards.findOneBy({
        id: socket.data.boardId,
      });

      if (!board) {
        console.error(`CreateCard: Board not found: ${socket.data.boardId}`);
        return;
      }

      const user = await Users.findOneBy({
        id: socket.data.userId,
      });

      if (!user) {
        console.error(`CreateCard: User not found: ${socket.data.boardId}`);
        return;
      }

      const card = new Cards();
      card.content = content;
      card.column = column;
      card.board = board;
      card.user = user;
      card.stackedOn = '';

      await card.save();

      socket.emit('CardState', getRawObject(card));
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

      socket.emit('CardState', getRawObject(card));
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

      socket.emit('DeleteCard', cardId);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('GetCards', () => {
    // search for board
    // get all cards
    // send cards data to everyone
  });

  socket.on('GroupCards', (cardId: number, stackedOn: number) => {
    // search for card
    // get all associated cards
    // prepare stacked cards
    // send stacked cards data to everyone
  });

  socket.on('UngroupCards', (cardId: number) => {
    // search for card
    // get all associated cards
    // unstack cards
    // send stacked cards data to everyone
  });

  socket.on('UpvoteCard', (cardId: number) => {
    // search for card
    // count total upvotes for board
    // insert upvote
    // send sum of votes for card to everyone
  });

  socket.on('DownvoteCard', (cardId: number) => {
    // search for card
    // remove vote LIMIT 1
    // send sum of votes for card to everyone
  });
};

export default registerCardHandlers;
