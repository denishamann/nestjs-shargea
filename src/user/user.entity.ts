import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { Transaction } from '../transactions/transaction.entity'
import { Category } from '../categories/category.entity'
import { Media } from '../media/media.entity'
import { CurrencyEnum } from './currency.enum'
import uuid from 'uuid'
import { Exclude } from 'class-transformer'

@Entity()
@Unique(['email'])
export class User extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: uuid

  @Column({ length: 255, nullable: false })
  email: string

  @Exclude()
  @Column({ length: 60, nullable: false })
  password: string

  @Column({
    type: 'enum',
    enum: CurrencyEnum,
    default: CurrencyEnum.EURO,
  })
  currency: CurrencyEnum

  @Exclude()
  @Column({ default: false })
  verified: boolean

  @Column({ nullable: true, default: null })
  defaultCategoryId: uuid

  @Column({ nullable: true, default: null })
  pictureId: uuid

  @Column({ length: 50, nullable: true, default: null })
  lastLoginDate: string

  @Column({ length: 255, nullable: true, default: null })
  lastLoginIp: string

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
  @OneToOne(() => Category, category => category.userForDefaultCategory)
  @JoinColumn()
  defaultCategory: Category

  @Exclude()
  @OneToOne(() => Media, media => media.userForPicture)
  @JoinColumn()
  picture: Media

  @Exclude()
  @OneToMany(() => Media, media => media.user)
  media: Media[]

  @Exclude()
  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[]

  @Exclude()
  @OneToMany(() => Category, category => category.user)
  categories: Category[]

  validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }
}
