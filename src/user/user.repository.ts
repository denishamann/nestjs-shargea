import { EntityRepository, Repository } from 'typeorm'
import { User } from './user.entity'
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto'
import { BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { UpdateUserDto } from './update-user.dto'

const PG_UNIQUE_CONSTRAINT_VIOLATION = '23505'
const PG_FOREIGN_KEY_CONSTRAINT_VIOLATION = '23503'

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  private static _hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  }

  async signUp(authCredentialsDto: AuthCredentialsDto, verificationEnabled: boolean): Promise<User> {
    const { email, password } = authCredentialsDto
    const salt = await bcrypt.genSalt()
    const user = Object.assign(this.create(), {
      email,
      verified: !verificationEnabled,
      password: await UserRepository._hashPassword(password, salt),
    })
    try {
      return await user.save()
    } catch (e) {
      if (e.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new ConflictException('Email already exists')
      }
      throw new InternalServerErrorException()
    }
  }

  async validatePassword(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { email, password } = authCredentialsDto
    const user = await this.findOne({ where: { email } })
    if (user && await user.validatePassword(password)) {
      return user
    } else {
      return null
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, user: User): Promise<User> {
    const updatedUser = Object.assign(user, updateUserDto)
    try {
      return await updatedUser.save()
    } catch (e) {
      if (e.code === PG_FOREIGN_KEY_CONSTRAINT_VIOLATION) {
        throw new BadRequestException(`Invalid pictureId or defaultCategoryId provided.`)
      }
      throw new InternalServerErrorException()
    }
  }
}
