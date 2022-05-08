enum Events {
  Join = 'USER/JOIN',
  Disconnect = 'USER/DISCONNECT',
  ChangeNickname = 'USER/CHANGE_NICKNAME',
  ChangeAvatar = 'USER/CHANGE_AVATAR',

  CreateCard = 'CARDS/CREATE',
  UpdateCard = 'CARDS/UPDATE_CARD',
  DeleteCard = 'CARDS/DELETE',
  GetCards = 'CARDS/GET_CARDS',
  GroupCards = 'CARDS/GROUP_CARDS',
  UngroupCards = 'CARDS/UNGROUP_CARDS',
  UpvoteCard = 'CARDS/UPVOTE',
  DownvoteCard = 'CARDS/DOWNVOTE',

  SetStage = 'BOARD/SET_STAGE',
  SetTimer = 'BOARD/SET_TIMER',
}

export default Events;
