type UserEvents = {
  Join: (boardId: number, boardCode: string, nickname: string, avatarId: number) => void;
  Disconnect: () => void;
  ChangeNickname: (nickname: string) => void;
  ChangeAvatar: (avatarId: number) => void;
}

export default UserEvents;
