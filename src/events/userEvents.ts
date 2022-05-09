export type IncomingUserEvents = {
  Join: (boardId: number, boardCode: string, nickname: string) => void;
  ToggleReady: () => void;
  ChangeUserData: (nickname: string, avatarId: number) => void;
}

export type OutgoingUserEvents = {
  UserState: () => {
    nickname: string;
    avatarId: number;
    isReady: boolean;
    createdAt: number;
    updatedAt: number;
  };
}
