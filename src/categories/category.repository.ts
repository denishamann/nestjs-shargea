import { EntityRepository, Like, Repository } from 'typeorm'
import { Category } from './category.entity'
import { CreateCategoryDto } from './dto/create-category.dto'
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto'
import { User } from '../user/user.entity'
import { BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'
import { UpdateCategoryDto } from './dto/update-category.dto'
import uuid from 'uuid'

const PG_FOREIGN_KEY_CONSTRAINT_VIOLATION = '23503'

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  private logger = new Logger('CategoryRepository')

  async getCategories(filterDto: GetCategoriesFilterDto, user: User): Promise<Category[]> {
    const { search } = filterDto
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
    try {
      return await this.find({ where })
    } catch (e) {
      this.logger.error(`Failed to get categories for User "${user.email}". Filters: ${JSON.stringify(filterDto)}`, e.stack)
      throw new InternalServerErrorException()
    }
  }

  async createCategory(createCategoryDto: CreateCategoryDto, user: User): Promise<Category> {
    const category = Object.assign(new Category(), createCategoryDto, { user })
    try {
      return await category.save()
    } catch (e) {
      this.logger.error(`Failed to create category for User "${user.email}". Data: ${JSON.stringify(createCategoryDto)}`, e.stack)
      if (e.code === PG_FOREIGN_KEY_CONSTRAINT_VIOLATION) {
        throw new BadRequestException('Invalid mediaId or parentCategoryId provided.')
      }
      throw new InternalServerErrorException()
    }
  }

  async updateCategory(category: Category, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const updatedCategory = Object.assign(category, updateCategoryDto)
    try {
      return await updatedCategory.save()
    } catch (e) {
      if (e.code === PG_FOREIGN_KEY_CONSTRAINT_VIOLATION) {
        throw new BadRequestException(`Invalid mediaId or parentCategoryId provided for category with ID "${category.id}".`)
      }
      throw new InternalServerErrorException()
    }
  }

  async deleteCategory(id: uuid, user: User): Promise<void> {
    let res
    try {
      res = await this.delete({ id, userId: user.id })
    } catch (e) {
      if (e.code === PG_FOREIGN_KEY_CONSTRAINT_VIOLATION) {
        throw new BadRequestException(`Category with ID "${id}" is still referenced.`)
      }
      throw new InternalServerErrorException()
    }
    if (res.affected === 0) {
      throw new NotFoundException(`Category with ID "${id}" not found.`)
    }
  }
}
