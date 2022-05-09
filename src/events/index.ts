import { IncomingUserEvents, OutgoingUserEvents } from './userEvents';
import { IncomingCardEvents, OutgoingCardEvents } from './cardEvents';
import { IncomingBoardEvents, OutgoingBoardEvents } from './boardEvents';

export type IncomingEvents = IncomingUserEvents & IncomingCardEvents & IncomingBoardEvents;
export type OutgoingEvents = OutgoingUserEvents & OutgoingCardEvents & OutgoingBoardEvents;
