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
import Cards from './Cards';

@Entity()
export default class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @OneToMany(() => Votes, (vote) => vote.user)
    votes: Votes[];

  @OneToMany(() => Cards, (card) => card.user)
    cards: Cards[];

  @ManyToOne(() => Boards, (board) => board.users)
  @JoinColumn({ name: 'board_id' })
    board: Boards;

  @Column({
    type: 'varchar',
    length: 256,
    name: 'sid',
  })
    sid: string;

  @Column({
    type: 'boolean',
    name: 'is_ready',
  })
    isReady: boolean;

  @Column({
    type: 'boolean',
    name: 'connected',
  })
    connected: boolean;

  @Column({
    type: 'varchar',
    length: 64,
    name: 'nickname',
  })
    nickname: string;

  @Column({
    type: 'integer',
    name: 'avatar',
  })
    avatar: number;

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

export type RawUser = {
  id: string,
  nickname: string,
  avatar: number,
  isReady: boolean,
}

export function getRawUser(user: Users): RawUser {
  return {
    id: user.id,
    avatar: user.avatar,
    isReady: user.isReady,
    nickname: user.nickname,
  };
}
