import { RawUser } from '../models/db/Users';
import { RawCard } from '../models/db/Cards';

export type IncomingUsersEvents = {
  Join: (data: {boardId: string, nickname: string; avatar: number;}) => void;
  ToggleReady: () => void;
  ChangeUserData: (data: {nickname: string, avatar: number}) => void;
}

export type OutgoingUsersEvents = {
  Joined: (data: {
    localUser: RawUser,
    users: RawUser[],
    cards: RawCard[],
    board: {id: string, stage: number, maxVotes: number, timerTo: number}
  }) => void;
  UserState: (data: {user: RawUser}) => void;
  UsersState: (data: {users: RawUser[]}) => void;
}
