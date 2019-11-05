import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import { Entry } from '../entries/entry.entity'
import { Media } from '../media/media.entity'
import uuid from 'uuid'
import { Exclude } from 'class-transformer'

@Entity()
export class Category extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: uuid

  @Column({ length: 20, nullable: false })
  title: string

  @Column({ length: 250, nullable: true, default: null })
  description: string

  @Column({ nullable: true, default: null })
  imageId: uuid

  @Column({ nullable: true, default: null })
  parentCategoryId: uuid

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
  @OneToOne(() => Media, media => media.user)
  @JoinColumn()
  image: Media

  @Exclude()
  @OneToOne(() => User, user => user.defaultCategory, { onDelete: 'CASCADE' })
  userForDefaultCategory: User

  @Exclude()
  @OneToMany(() => Entry, entry => entry.category)
  entries: Entry[]

  @Exclude()
  @ManyToOne(() => User, user => user.categories, { onDelete: 'CASCADE' })
  user: User

  @Exclude()
  @ManyToOne(() => Category, category => category.childrenCategories)
  parentCategory: Category

  @OneToMany(() => Category, service => service.parentCategory)
  childrenCategories: Category[]
}
