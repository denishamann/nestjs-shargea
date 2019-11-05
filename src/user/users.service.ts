import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto'
import { UserRepository } from './user.repository'
import { User } from './user.entity'
import uuid from 'uuid'
import { UpdateUserDto } from './update-user.dto'
import { MediaService } from '../media/media.service'
import { CategoriesService } from '../categories/categories.service'

@Injectable()
export class UsersService {

  private readonly logger = new Logger()

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly mediaService: MediaService,
    private readonly categoriesService: CategoriesService,
  ) {
  }

  findOne(email: string): Promise<User> {
    return this.userRepository.findOne({ email })
  }

  signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.userRepository.signUp(authCredentialsDto)
  }

  validatePassword(authCrendentialsDto: AuthCredentialsDto): Promise<User> {
    return this.userRepository.validatePassword(authCrendentialsDto)
  }

  async updateUser(updateUserDto: UpdateUserDto, user: User): Promise<User> {
    if (Object.entries(updateUserDto).length === 0) {
      return user
    }
    try {
      // those calls are done to ensure that the category and/or media provided belongs to the user
      // TODO: replace this to do only one db call
      if (updateUserDto.defaultCategoryId) {
        await this.categoriesService.getCategoryById(updateUserDto.defaultCategoryId, user)
      }
      if (updateUserDto.pictureId) {
        await this.mediaService.getMediaById(updateUserDto.pictureId, user)
      }
    } catch (e) {
      this.logger.warn(`updateUser: pictureId or defaultCategoryId from other user`, e)
      throw new BadRequestException(`Invalid pictureId or defaultCategoryId provided.`)
    }

    // becauseuserRepository.updateUser modifies the object ...
    const previousImageId = user.pictureId

    const updatedUser = await this.userRepository.updateUser(updateUserDto, user)

    if (
      previousImageId
      && updateUserDto.hasOwnProperty('pictureId')
      && (updateUserDto.pictureId === null || updateUserDto.pictureId !== previousImageId)
    ) {
      try {
        await this.mediaService.deleteMedia(previousImageId, user)
      } catch (e) {
        this.logger.error(`User successfully updated but media with id ${previousImageId} could not be deleted.`)
      }
    }
    return updatedUser
  }

  async deleteUser(id: uuid): Promise<void> {
    await this.userRepository.delete({ id })
  }
}
