export type IncomingUserEvents = {
  Join: (boardId: number, boardCode: string, nickname: string, avatarId: number) => void;
  ToggleReady: () => void;
  Disconnect: () => void;
  ChangeNickname: (nickname: string) => void;
  ChangeAvatar: (avatarId: number) => void;
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
