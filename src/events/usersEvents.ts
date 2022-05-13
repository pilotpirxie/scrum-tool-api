import { RawUser } from '../models/db/Users';
import { RawCard } from '../models/db/Cards';

export type IncomingUsersEvents = {
  Join: (data: {boardId: string, nickname: string}) => void;
  ToggleReady: () => void;
  ChangeUserData: (data: {nickname: string, avatar: number}) => void;
}

export type OutgoingUsersEvents = {
  Joined: (data: {
    users: RawUser[],
    cards: RawCard[],
    board: {id: string, stage: number, timerTo: string}
  }) => void;
  UserState: (data: {user: RawUser}) => void;
  UsersState: (data: {users: RawUser[]}) => void;
}
