export type IncomingBoardEvents = {
  SetTimer: (duration: number) => void;
  SetStage: (stage: number) => void;
}

export type OutgoingBoardEvents = {
  BoardConfig: (board: {stage: number, timerTo: Date}) => void;
}
