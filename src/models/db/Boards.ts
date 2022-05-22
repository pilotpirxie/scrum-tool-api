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

export enum BoardMode {
  RETRO= 'retro',
  PLANNING_HIDDEN = 'planning_hidden',
  PLANNING_REVEALED = 'planning_revealed',
}

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
    type: 'varchar',
    name: 'mode',
  })
    mode: string;

  @Column({
    name: 'timer_to',
  })
    timerTo: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
    createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
    updatedAt: Date;
}
