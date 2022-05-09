import {
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

@Entity()
export default class Cards {
  @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => Boards, (board) => board.cards)
  @JoinColumn({ name: 'board_id' })
    boardId: Boards;

  @Column({
    type: 'varchar',
    length: 512,
    name: 'content',
  })
    content: string;

  @Column({
    type: 'integer',
    name: 'stacked_on',
  })
    stackedOn: number;

  @Column({
    type: 'integer',
    name: 'user_id',
  })
    userId: number;

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

  @OneToMany(() => Votes, (vote) => vote.cardId)
    votes: Votes[];
}
