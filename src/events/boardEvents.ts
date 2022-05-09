export type IncomingBoardEvents = {
  SetTimer: (duration: number) => void;
  SetStage: (stage: number) => void;
}

export type OutgoingBoardEvents = {
  BoardConfig: () => {
    stage: number;
    timer: number;
  };
}
