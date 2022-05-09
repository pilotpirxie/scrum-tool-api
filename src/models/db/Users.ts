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
  @PrimaryGeneratedColumn()
    id: number;

  @Column({
    type: 'varchar',
    length: 256,
    name: 'sid',
  })
    sid: string;

  @ManyToOne(() => Boards, (board) => board.users)
  @JoinColumn({ name: 'board_id' })
    boardId: number;

  @Column({
    type: 'boolean',
    name: 'is_ready',
  })
    isReady: boolean;

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

  @OneToMany(() => Cards, (card) => card.userId)
    votes: Votes[];
}
