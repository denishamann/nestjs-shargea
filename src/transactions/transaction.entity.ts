import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import { Category } from '../categories/category.entity'
import { Media } from '../media/media.entity'
import uuid from 'uuid'
import { Exclude, Transform } from 'class-transformer'

@Entity()
export class Transaction extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: uuid

  @Column({ length: 20, nullable: false })
  title: string

  @Column({ length: 250, nullable: true })
  description: string

  @Transform(amount => parseFloat(amount))
  @Column('decimal', { nullable: false })
  amount: number

  @Column({ nullable: true })
  categoryId: uuid

  @Column({ nullable: true })
  date: string

  @Column({ nullable: true })
  imageId: uuid

  @Exclude()
  @Column({ nullable: false })
  userId: uuid

  @CreateDateColumn()
  creationDate: string

  @UpdateDateColumn()
  modificationDate: string

  @VersionColumn()
  version: number

  /**
   * Relations
   */

  @Exclude()
  @OneToOne(() => Media, media => media.transaction)
  @JoinColumn()
  image: Media

  @Exclude()
  @ManyToOne(() => Category, category => category.transactions)
  category: Category

  @Exclude()
  @ManyToOne(() => User, user => user.transactions, { onDelete: 'CASCADE' })
  user: User
}
