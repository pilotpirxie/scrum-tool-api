export type IncomingBoardsEvents = {
  SetTimer: (data: {duration: number}) => void;
  SetStage: (data: {stage: number}) => void;
}

export type OutgoingBoardsEvents = {
  BoardConfig: (data: {board: {stage: number, timerTo: string}}) => void;
}
