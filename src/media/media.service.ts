import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Media } from './media.entity'
import { CreateMediaDto } from './dto/create-media.dto'
import { User } from '../user/user.entity'
import uuid from 'uuid'
import { MediaRepository } from './media.repository'
import { UpdateMediaDto } from './dto/update-media.dto'

@Injectable()
export class MediaService {

  constructor(
    @InjectRepository(MediaRepository)
    private readonly mediaRepository: MediaRepository) {
  }

  getAllMedia(user: User): Promise<Media[]> {
    return this.mediaRepository.find({ where: { userId: user.id } })
  }

  async getMediaById(id: uuid, user): Promise<Media> {
    const result = await this.mediaRepository.findOne({ where: { id, userId: user.id } })
    if (!result) {
      throw new NotFoundException(`Media with ID "${id}" not found.`)
    } else {
      return result
    }
  }

  createMedia(createMediaDto: CreateMediaDto, user: User): Promise<Media> {
    const newMedia = Object.assign(new Media(), createMediaDto, { user })
    return newMedia.save()
  }

  async updateMedia(id: uuid, updateMediaDto: UpdateMediaDto, user: User): Promise<Media> {
    const media = await this.getMediaById(id, user)
    if (Object.entries(updateMediaDto).length === 0) {
      return media
    }
    const updatedMedia = Object.assign(media, updateMediaDto)
    return await updatedMedia.save()
  }

  deleteMedia(id: uuid, user: User): Promise<void> {
    return this.mediaRepository.deleteMedia(id, user)
  }
}
