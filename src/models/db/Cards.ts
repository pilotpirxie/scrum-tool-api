import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Boards from './Boards';
import Votes from './Votes';
import Users from './Users';

@Entity()
export default class Cards extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @ManyToOne(() => Boards, (board) => board.cards)
  @JoinColumn({ name: 'board_id' })
    board: Boards;

  @OneToMany(() => Votes, (vote) => vote.card)
    votes: Votes[];

  @ManyToOne(() => Users, (user) => user.cards)
  @JoinColumn({ name: 'user_id' })
    user: Users;

  @Column({
    type: 'varchar',
    length: 512,
    name: 'content',
  })
    content: string;

  @Column({
    type: 'varchar',
    name: 'stacked_on',
  })
    stackedOn: string;

  @Column({
    type: 'integer',
    name: 'column',
  })
    column: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
    createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
    updatedAt: Date;
}

export type RawCard = {
  id: string,
  stackedOn: string,
  content: string,
  userId: string,
  column: number,
  votes: number,
}

export function getRawCard(card: Cards): RawCard {
  return {
    id: card.id,
    stackedOn: card.stackedOn,
    content: card.content,
    userId: card.user.id,
    column: card.column,
    votes: card.votes.length,
  };
}
