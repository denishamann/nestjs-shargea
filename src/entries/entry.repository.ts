import { EntityRepository, Like, Repository } from 'typeorm'
import { Entry } from './entry.entity'
import { CreateEntryDto } from './dto/create-entry.dto'
import { GetEntriesFilterDto } from './dto/get-entries-filter.dto'
import { User } from '../user/user.entity'
import { BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common'
import { UpdateEntryDto } from './dto/update-entry.dto'

const PG_UNIQUE_CONSTRAINT_VIOLATION = '23505'
const PG_FOREIGN_KEY_CONSTRAINT_VIOLATION = '23503'

@EntityRepository(Entry)
export class EntryRepository extends Repository<Entry> {
  private logger = new Logger('EntryRepository')

  async getEntries(filterDto: GetEntriesFilterDto, user: User): Promise<Entry[]> {
    const { search } = filterDto
    try {
      const where = search ? [
        {
          title: Like(`%${search}%`),
          userId: user.id,
        },
        {
          description: Like(`%${search}%`),
          userId: user.id,
        },
      ] : { userId: user.id }
      return await this.find({ where })
    } catch (e) {
      this.logger.error(`Failed to get entries for User "${user.email}". Filters: ${JSON.stringify(filterDto)}`, e.stack)
      throw new InternalServerErrorException()
    }
  }

  async createEntry(createEntryDto: CreateEntryDto, user: User): Promise<Entry> {
    const entry = Object.assign(new Entry(), createEntryDto, { user })
    try {
      return await entry.save()
    } catch (e) {
      this.logger.error(`Failed to create entry for User "${user.email}". Data: ${JSON.stringify(createEntryDto)}`, e.stack)
      if (e.code === PG_FOREIGN_KEY_CONSTRAINT_VIOLATION) {
        throw new BadRequestException('Invalid mediaId or categoryId provided.')
      } else if (e.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new BadRequestException(`Media with ID "${entry.id}" is already linked with another entity.`)
      }
      throw new InternalServerErrorException()
    }
  }

  async updateEntry(entry: Entry, updateEntryDto: UpdateEntryDto) {
    const updatedEntry = Object.assign(entry, updateEntryDto)
    try {
      return await updatedEntry.save()
    } catch (e) {
      if (e.code === PG_FOREIGN_KEY_CONSTRAINT_VIOLATION) {
        throw new BadRequestException(`Invalid mediaId or categoryId provided for category with ID "${entry.id}".`)
      } else if (e.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new BadRequestException(`Media with ID "${entry.id}" is already linked with another entity.`)
      }
      throw new InternalServerErrorException()
    }
  }
}
