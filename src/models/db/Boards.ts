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
  @PrimaryGeneratedColumn()
    id: number;

  @Column({
    type: 'varchar',
    length: 64,
    name: 'name',
  })
    code: string;

  @Column({
    type: 'integer',
    name: 'stage',
  })
    stage: number;

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

  @OneToMany(() => Cards, (card) => card.boardId)
    cards: Cards[];

  @OneToMany(() => Users, (user) => user.boardId)
    users: Users[];
}
