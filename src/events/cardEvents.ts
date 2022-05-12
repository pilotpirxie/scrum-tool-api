import { RawCard } from '../models/db/Cards';

export type IncomingCardEvents = {
  CreateCard: (content: string, column: number) => void;
  UpdateCard: (cardId: string, content: string) => void;
  DeleteCard: (cardId: string) => void;
  GetCards: () => void;
  GroupCards: (cardId: string, stackedOn: string) => void;
  UngroupCards: (cardId: string) => void;
  UpvoteCard: (cardId: string) => void;
  DownvoteCard: (cardId: string) => void;
}
export type OutgoingCardEvents = {
  CardState: (card: RawCard) => void;
  DeleteCard: (cardId: string) => void;
  CardsState: (cards: RawCard[]) => void;
}
