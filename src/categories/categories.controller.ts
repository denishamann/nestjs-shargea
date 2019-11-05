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
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto'
import { Category } from './category.entity'
import { AuthGuard } from '@nestjs/passport'
import { User } from '../user/user.entity'
import { GetUser } from '../user/get-user.decorator'
import uuid from 'uuid'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiUseTags('categories')
@Controller('categories')
@UseGuards(AuthGuard())
@UseInterceptors(ClassSerializerInterceptor)
export class CategoriesController {
  private logger = new Logger('CategoriesController')

  constructor(private readonly categoriesService: CategoriesService) {
  }

  @Get()
  getCategories(
    @Query(new ValidationPipe({ whitelist: true, transform: true })) filterDto: GetCategoriesFilterDto,
    @GetUser() user: User,
  ): Promise<Category[]> {
    this.logger.verbose(`User "${user.email}" retrieving all categories. Filters: ${JSON.stringify(filterDto)}`)
    return this.categoriesService.getCategories(filterDto, user)
  }

  @Get('/:id')
  getCategoryById(
    @Param('id', new ParseUUIDPipe()) id: uuid,
    @GetUser() user: User,
  ): Promise<Category> {
    return this.categoriesService.getCategoryById(id, user)
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: User,
  ): Promise<Category> {
    this.logger.verbose(`User "${user.email}" creating a new category. Data: ${JSON.stringify(createCategoryDto)}`)
    return this.categoriesService.createCategory(createCategoryDto, user)
  }

  @Patch('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateCategory(
    @Param('id', new ParseUUIDPipe()) id: uuid,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @GetUser() user: User,
  ): Promise<Category> {
    return this.categoriesService.updateCategory(id, updateCategoryDto, user)
  }

  @Delete('/:id')
  deleteCategory(
    @Param('id', new ParseUUIDPipe()) id: uuid,
    @GetUser() user: User,
  ): Promise<void> {
    return this.categoriesService.deleteCategory(id, user)
  }
}
