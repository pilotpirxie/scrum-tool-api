import { Socket } from 'socket.io';
import { IncomingEvents, OutgoingEvents } from '../events';
import { User } from '../models/socket/User';

const registerBoardHandlers = (socket: Socket<IncomingEvents, OutgoingEvents, {}, User>) => {
  socket.on('SetTimer', (duration: number) => {
    // search for board
    // set timer to now + duration
    // emit timer set
  });

  socket.on('SetStage', (stage: number) => {
    // search for board
    // set board to stage
    // emit stage set
  });
};

export default registerBoardHandlers;
