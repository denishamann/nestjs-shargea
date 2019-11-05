import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { EntriesService } from './entries.service'
import { CreateEntryDto } from './dto/create-entry.dto'
import { GetEntriesFilterDto } from './dto/get-entries-filter.dto'
import { Entry } from './entry.entity'
import { AuthGuard } from '@nestjs/passport'
import { User } from '../user/user.entity'
import { GetUser } from '../user/get-user.decorator'
import uuid from 'uuid'
import { UpdateEntryDto } from './dto/update-entry.dto'
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiUseTags('entries')
@Controller('entries')
@UseGuards(AuthGuard())
@UseInterceptors(ClassSerializerInterceptor)
export class EntriesController {
  private logger = new Logger('EntriesController')

  constructor(private readonly entriesService: EntriesService) {
  }

  @Get()
  getEntries(
    @Query(new ValidationPipe({ whitelist: true, transform: true })) filterDto: GetEntriesFilterDto,
    @GetUser() user: User,
  ): Promise<Entry[]> {
    this.logger.verbose(`User "${user.email}" retrieving all entries. Filters: ${JSON.stringify(filterDto)}`)
    return this.entriesService.getEntries(filterDto, user)
  }

  @Get('/:id')
  getEntryById(
    @Param('id', new ParseUUIDPipe()) id: uuid,
    @GetUser() user: User,
  ): Promise<Entry> {
    return this.entriesService.getEntryById(id, user)
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createEntry(
    @Body() createEntryDto: CreateEntryDto,
    @GetUser() user: User,
  ): Promise<Entry> {
    this.logger.verbose(`User "${user.email}" creating a new entry. Data: ${JSON.stringify(createEntryDto)}`)
    return this.entriesService.createEntry(createEntryDto, user)
  }

  @Patch('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateEntry(
    @Param('id', new ParseUUIDPipe()) id: uuid,
    @Body() updateEntryDto: UpdateEntryDto,
    @GetUser() user: User,
  ): Promise<Entry> {
    return this.entriesService.updateEntry(id, updateEntryDto, user)
  }

  @Delete('/:id')
  deleteEntry(
    @Param('id', new ParseUUIDPipe()) id: uuid,
    @GetUser() user: User,
  ): Promise<void> {
    return this.entriesService.deleteEntry(id, user)
  }
}
