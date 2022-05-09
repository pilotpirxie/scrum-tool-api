export type IncomingUserEvents = {
  Join: (boardId: number, boardCode: string, nickname: string) => void;
  ToggleReady: () => void;
  ChangeUserData: (nickname: string, avatarId: number) => void;
}

export type OutgoingUserEvents = {
  UserState: (user: {
    nickname: string,
    avatarId: number,
    isReady: boolean,
    createdAt: number,
    updatedAt: number,
  }) => void;
}
