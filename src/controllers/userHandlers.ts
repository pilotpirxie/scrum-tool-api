import { Socket } from 'socket.io';
import { IncomingEvents, OutgoingEvents } from '../events';
import { User } from '../models/socket/User';

const registerUserHandlers = (socket: Socket<IncomingEvents, OutgoingEvents, {}, User>) => {
  socket.on('disconnect', () => {
    console.info('disconnected');
  });

  socket.on('Join', (boardId: number, boardCode: string, nickname: string) => {
    // search for board
    // join room with boardid and boardcode
    // create user associated with the room
    // send userdata to client
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
