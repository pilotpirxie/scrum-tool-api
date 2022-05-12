import { RawUser } from '../models/db/Users';

export type IncomingUserEvents = {
  Join: (boardId: string, nickname: string) => void;
  ToggleReady: () => void;
  ChangeUserData: (nickname: string, avatarId: number) => void;
}

export type OutgoingUserEvents = {
  UserState: (user: RawUser) => void;
  UsersState: (users: RawUser[]) => void;
}
