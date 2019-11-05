import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { EntryRepository } from './entry.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { Entry } from './entry.entity'
import { CreateEntryDto } from './dto/create-entry.dto'
import { GetEntriesFilterDto } from './dto/get-entries-filter.dto'
import { User } from '../user/user.entity'
import uuid from 'uuid'
import { UpdateEntryDto } from './dto/update-entry.dto'
import { MediaService } from '../media/media.service'
import { CategoriesService } from '../categories/categories.service'

@Injectable()
export class EntriesService {
  private readonly logger = new Logger()

  constructor(
    @InjectRepository(EntryRepository)
    private readonly entryRepository: EntryRepository,
    private readonly mediaService: MediaService,
    private readonly categoriesService: CategoriesService,
  ) {
  }

  getEntries(filterDto: GetEntriesFilterDto, user: User): Promise<Entry[]> {
    return this.entryRepository.getEntries(filterDto, user)
  }

  async getEntryById(id: uuid, user): Promise<Entry> {
    const result = await this.entryRepository.findOne({ where: { id, userId: user.id } })
    if (!result) {
      throw new NotFoundException(`Entry with ID "${id}" not found.`)
    } else {
      return result
    }
  }

  async createEntry(createEntryDto: CreateEntryDto, user: User): Promise<Entry> {
    try {
      // those calls are done to ensure that the category and/or media provided belongs to the user
      // TODO: replace this to do only one db call
      if (createEntryDto.imageId) {
        await this.mediaService.getMediaById(createEntryDto.imageId, user)
      }
      if (createEntryDto.categoryId) {
        await this.categoriesService.getCategoryById(createEntryDto.categoryId, user)
      }
    } catch (e) {
      this.logger.warn(`createEntry: mediaId or categoryId from other user`, e)
      throw new BadRequestException('Invalid mediaId or categoryId provided.')
    }
    return this.entryRepository.createEntry(createEntryDto, user)
  }

  async updateEntry(id: uuid, updateEntryDto: UpdateEntryDto, user: User): Promise<Entry> {
    const entry = await this.getEntryById(id, user)

    // because entryRepository.updateEntry modifies the object ...
    const previousImageId = entry.imageId

    if (Object.entries(updateEntryDto).length === 0) {
      return entry
    }
    try {
      // those calls are done to ensure that the category and/or media provided belongs to the user
      // TODO: replace this to do only one db call
      if (updateEntryDto.imageId) {
        await this.mediaService.getMediaById(updateEntryDto.imageId, user)
      }
      if (updateEntryDto.categoryId) {
        await this.categoriesService.getCategoryById(updateEntryDto.categoryId, user)
      }
    } catch (e) {
      this.logger.warn(`updateEntry: mediaId or categoryId from other user`, e)
      throw new BadRequestException('Invalid mediaId or categoryId provided.')
    }

    const updatedEntry = await this.entryRepository.updateEntry(entry, updateEntryDto)

    if (
      previousImageId
      && updateEntryDto.hasOwnProperty('imageId')
      && (updateEntryDto.imageId === null || updateEntryDto.imageId !== previousImageId)
    ) {
      try {
        await this.mediaService.deleteMedia(previousImageId, user)
      } catch (e) {
        this.logger.error(`Entry successfully updated but media with id ${previousImageId} could not be deleted.`)
      }
    }
    return updatedEntry
  }

  async deleteEntry(id: uuid, user: User): Promise<void> {
    const { imageId } = await this.getEntryById(id, user)
    const res = await this.entryRepository.delete({ id, userId: user.id })

    if (res.affected === 0) {
      throw new NotFoundException(`Entry with ID "${id}" not found.`)
    }
    if (imageId) {
      try {
        await this.mediaService.deleteMedia(imageId, user)
      } catch (e) {
        this.logger.error(`Entry successfully deleted but media with id ${imageId} could not be deleted.`)
      }
    }
  }
}
