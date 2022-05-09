export type IncomingCardEvents = {
  CreateCard: (content: string, column: number) => void;
  UpdateCard: (cardId: number, content: string) => void;
  DeleteCard: (cardId: number) => void;
  GetCards: () => void;
  GroupCards: (cardId: number, stackedOn: number) => void;
  UngroupCards: (cardId: number) => void;
  UpvoteCard: (cardId: number) => void;
  DownvoteCard: (cardId: number) => void;
}
export type OutgoingCardEvents = {
  CardState: () => {
    id: number;
    stackedOn: number;
    content: string;
    userId: number;
    column: number;
    votes: number;
    createdAt: Date;
    updatedAt: Date;
  };
}
