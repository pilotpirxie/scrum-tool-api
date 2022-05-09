import { Socket } from 'socket.io';
import { IncomingEvents, OutgoingEvents } from '../events';
import { User } from '../models/socket/User';

const registerCardHandlers = (socket: Socket<IncomingEvents, OutgoingEvents, {}, User>) => {
  socket.on('CreateCard', (content: string, column: number) => {
    // search for board
    // create card
    // send card data to everyone
  });

  socket.on('UpdateCard', (cardId: number, content: string) => {
    // search for card
    // update card
    // send card data to everyone
  });

  socket.on('DeleteCard', (cardId: number) => {
    // search for card
    // delete card
    // send card data to everyone
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
