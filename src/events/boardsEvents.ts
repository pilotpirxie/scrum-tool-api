export type IncomingBoardsEvents = {
  SetTimer: (data: {duration: number}) => void;
  SetMaxVotes: (data: {maxVotes: number}) => void;
  SetStage: (data: {stage: number}) => void;
}

export type OutgoingBoardsEvents = {
  BoardConfig: (data: {board: {stage: number, timerTo: number, maxVotes: number}}) => void;
}
