import UserEvents from './UserEvents';
import CardEvents from './CardEvents';
import BoardEvents from './BoardEvents';

export type IncomingEvents = UserEvents & CardEvents & BoardEvents;
