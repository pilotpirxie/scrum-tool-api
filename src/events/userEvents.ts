import { RawUser } from '../models/db/Users';

export type IncomingUserEvents = {
  Join: (data: {boardId: string, nickname: string}) => void;
  ToggleReady: () => void;
  ChangeUserData: (data: {nickname: string, avatar: number}) => void;
}

export type OutgoingUserEvents = {
  UserState: (data: {user: RawUser}) => void;
  UsersState: (data: {users: RawUser[]}) => void;
}
