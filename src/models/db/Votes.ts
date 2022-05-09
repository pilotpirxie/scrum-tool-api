import {
  CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import Users from './Users';
import Cards from './Cards';

@Entity()
export default class Votes {
  @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => Cards, (cards) => cards.votes)
  @JoinColumn({ name: 'card_id' })
    cardId: number;

  @ManyToOne(() => Users, (user) => user.votes)
  @JoinColumn({ name: 'user_id' })
    userId: number;

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