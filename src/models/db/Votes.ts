import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Users from './Users';
import Cards from './Cards';

@Entity()
export default class Votes extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @ManyToOne(() => Cards, (cards) => cards.votes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'card_id' })
    card: Cards;

  @ManyToOne(() => Users, (user) => user.votes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
    user: Users;

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
