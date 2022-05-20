import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Cards from './Cards';
import Users from './Users';

@Entity()
export default class Boards extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @OneToMany(() => Cards, (card) => card.board)
    cards: Cards[];

  @OneToMany(() => Users, (user) => user.board)
    users: Users[];

  @Column({
    type: 'integer',
    name: 'stage',
  })
    stage: number;

  @Column({
    type: 'integer',
    name: 'max_votes',
  })
    maxVotes: number;

  @Column({
    type: 'timestamp',
    name: 'timer_to',
  })
    timerTo: Date;

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
