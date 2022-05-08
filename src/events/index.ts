import { IncomingUserEvents, OutgoingUserEvents } from './UserEvents';
import { IncomingCardEvents, OutgoingCardEvents } from './CardEvents';
import { IncomingBoardEvents, OutgoingBoardEvents } from './BoardEvents';

export type IncomingEvents = IncomingUserEvents & IncomingCardEvents & IncomingBoardEvents;
export type OutgoingEvents = OutgoingUserEvents & OutgoingCardEvents & OutgoingBoardEvents;
