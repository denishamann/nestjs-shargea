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
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { MediaService } from './media.service'
import { CreateMediaDto } from './dto/create-media.dto'
import { Media } from './media.entity'
import { AuthGuard } from '@nestjs/passport'
import { User } from '../user/user.entity'
import { GetUser } from '../user/get-user.decorator'
import uuid from 'uuid'
import { UpdateMediaDto } from './dto/update-media.dto'
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiUseTags('media')
@Controller('media')
@UseGuards(AuthGuard())
@UseInterceptors(ClassSerializerInterceptor)
export class MediaController {
  private logger = new Logger('MediaController')

  constructor(private readonly mediaService: MediaService) {
  }

  @Get()
  getAllMedia(@GetUser() user: User): Promise<Media[]> {
    this.logger.verbose(`User "${user.email}" retrieving all media.`)
    return this.mediaService.getAllMedia(user)
  }

  @Get('/:id')
  getMediaById(
    @Param('id', new ParseUUIDPipe()) id: uuid,
    @GetUser() user: User,
  ): Promise<Media> {
    return this.mediaService.getMediaById(id, user)
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createMedia(
    @Body() createMediaDto: CreateMediaDto,
    @GetUser() user: User,
  ): Promise<Media> {
    this.logger.verbose(`User "${user.email}" creating a new media. Data: ${JSON.stringify(createMediaDto)}`)
    return this.mediaService.createMedia(createMediaDto, user)
  }

  @Patch('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateMedia(
    @Param('id', new ParseUUIDPipe()) id: uuid,
    @Body() updateMediaDto: UpdateMediaDto,
    @GetUser() user: User,
  ): Promise<Media> {
    return this.mediaService.updateMedia(id, updateMediaDto, user)
  }

  @Delete('/:id')
  deleteMedia(
    @Param('id', new ParseUUIDPipe()) id: uuid,
    @GetUser() user: User,
  ): Promise<void> {
    return this.mediaService.deleteMedia(id, user)
  }
}
