import { EntityRepository, Repository } from 'typeorm'
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { Media } from './media.entity'
import { User } from '../user/user.entity'
import uuid from 'uuid'

const PG_FOREIGN_KEY_CONSTRAINT_VIOLATION = '23503'

@EntityRepository(Media)
export class MediaRepository extends Repository<Media> {

  async deleteMedia(id: uuid, user: User): Promise<void> {
    let res
    try {
      res = await this.delete({ id, userId: user.id })
    } catch (e) {
      if (e.code === PG_FOREIGN_KEY_CONSTRAINT_VIOLATION) {
        throw new BadRequestException(`Media with ID "${id}" is still referenced.`)
      }
      throw new InternalServerErrorException()
    }
    if (res.affected === 0) {
      throw new NotFoundException(`Media with ID "${id}" not found.`)
    }
  }
}
