export type IncomingBoardEvents = {
  SetTimer: (data: {duration: number}) => void;
  SetStage: (data: {stage: number}) => void;
}

export type OutgoingBoardEvents = {
  BoardConfig: (data: {board: {stage: number, timerTo: Date}}) => void;
}
