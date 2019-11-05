import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn, VersionColumn } from 'typeorm'
import { User } from '../user/user.entity'
import * as uuid from 'uuid'

@Entity()
export class VerificationTokenEntity extends BaseEntity {

  @OneToOne(() => User, user => user.id, { eager: true, onDelete: 'CASCADE', primary: true })
  @JoinColumn({ name: 'userId' })
  user: User

  @PrimaryColumn()
  userId: uuid

  @Column({ length: 32, nullable: false })
  token: string

  @CreateDateColumn()
  creationDate: string

  @UpdateDateColumn()
  modificationDate: string

  @VersionColumn()
  version: number
}
