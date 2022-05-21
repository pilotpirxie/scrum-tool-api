export type IncomingBoardsEvents = {
  SetTimer: (data: {duration: number}) => void;
  SetBoardMode: (data: { mode: string }) => void;
  SetMaxVotes: (data: {maxVotes: number}) => void;
  SetStage: (data: {stage: number}) => void;
}

export type OutgoingBoardsEvents = {
  BoardConfig: (data: {board: {
    stage: number,
      timerTo: number,
      maxVotes: number,
      mode: string,
  }}) => void;
}
