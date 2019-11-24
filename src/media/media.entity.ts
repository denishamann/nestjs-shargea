import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm'
import { User } from '../user/user.entity'
import { Transaction } from '../transactions/transaction.entity'
import { Category } from '../categories/category.entity'
import { MediaType } from './media-type.enum'
import uuid from 'uuid'
import { Exclude } from 'class-transformer'

@Entity()
export class Media extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: uuid

  @Column({ length: 25, nullable: false })
  title: string

  @Column({ length: 250, nullable: true, default: null })
  description: string

  @Column({ length: 2048, nullable: false })
  url: string

  @Column({
    type: 'enum',
    enum: MediaType,
    default: MediaType.IMAGE,
  })
  type: MediaType

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
  @ManyToOne(() => User, user => user.media, { onDelete: 'CASCADE' })
  user: User

  @Exclude()
  @OneToOne(() => User, user => user.picture, { onDelete: 'CASCADE' })
  userForPicture: User

  @Exclude()
  @OneToOne(() => Transaction, transaction => transaction.image)
  transaction: Transaction

  @Exclude()
  @OneToOne(() => Category, category => category.image)
  category: Category
}
