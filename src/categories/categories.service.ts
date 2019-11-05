import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CategoryRepository } from './category.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from './category.entity'
import { CreateCategoryDto } from './dto/create-category.dto'
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto'
import { User } from '../user/user.entity'
import uuid from 'uuid'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { MediaService } from '../media/media.service'

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger()

  constructor(
    @InjectRepository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
    private readonly mediaService: MediaService,
  ) {
  }

  getCategories(filterDto: GetCategoriesFilterDto, user: User): Promise<Category[]> {
    return this.categoryRepository.getCategories(filterDto, user)
  }

  async getCategoryById(id: uuid, user: User): Promise<Category> {
    const result = await this._getCategoryById(id, user)
    if (!result) {
      throw new NotFoundException(`Category with ID "${id}" not found.`)
    } else {
      return result
    }
  }

  async createCategory(createCategoryDto: CreateCategoryDto, user: User): Promise<Category> {
    try {
      // those calls are done to ensure that the parentCategory and/or media provided belongs to the user
      // TODO: replace this to do only one db call
      if (createCategoryDto.imageId) {
        await this.mediaService.getMediaById(createCategoryDto.imageId, user)
      }
      if (createCategoryDto.parentCategoryId) {
        await this.getCategoryById(createCategoryDto.parentCategoryId, user)
      }
    } catch (e) {
      this.logger.warn(`createCategory: mediaId or parentCategoryId from other user`, e)
      throw new BadRequestException('Invalid mediaId or parentCategoryId provided.')
    }
    return this.categoryRepository.createCategory(createCategoryDto, user)
  }

  async updateCategory(id: uuid, updateCategoryDto: UpdateCategoryDto, user: User): Promise<Category> {
    const category = await this.getCategoryById(id, user)

    // because categoryRepository.updateCategory modifies the object ...
    const previousImageId = category.imageId

    if (Object.entries(updateCategoryDto).length === 0) {
      return category
    }
    try {
      // those calls are done to ensure that the parentCategory and/or media provided belongs to the user
      // TODO: replace this to do only one db call
      if (updateCategoryDto.imageId) {
        await this.mediaService.getMediaById(updateCategoryDto.imageId, user)
      }
      if (updateCategoryDto.parentCategoryId) {
        await this.getCategoryById(updateCategoryDto.parentCategoryId, user)
      }
    } catch (e) {
      this.logger.warn(`updateCategory: mediaId or parentCategoryId from other user`, e)
      throw new BadRequestException('Invalid mediaId or parentCategoryId provided.')
    }
    await this._checkForCyclic(id, updateCategoryDto.parentCategoryId, user)
    // TODO: we need to check if the updateCategoryDto fields are owned by the current user
    const updatedCategory = await this.categoryRepository.updateCategory(category, updateCategoryDto)

    if (
      previousImageId
      && updateCategoryDto.hasOwnProperty('imageId')
      && (updateCategoryDto.imageId === null || updateCategoryDto.imageId !== previousImageId)
    ) {
      try {
        await this.mediaService.deleteMedia(previousImageId, user)
      } catch (e) {
        this.logger.error(`Category successfully updated but media withh ID ${previousImageId} could not be deleted.`)
      }
    }
    return updatedCategory
  }

  async deleteCategory(id: uuid, user: User): Promise<void> {
    const { imageId } = await this.getCategoryById(id, user)
    await this.categoryRepository.deleteCategory(id, user)
    if (imageId) {
      try {
        await this.mediaService.deleteMedia(imageId, user)
      } catch (e) {
        this.logger.error(`Category successfully deleted but media with ID "${imageId}" could not be deleted.`)
      }
    }
  }

  private _getCategoryById(id: uuid, user: User): Promise<Category> {
    return this.categoryRepository.findOne({ where: { id, userId: user.id } })
  }

  private async _checkForCyclic(id: uuid, parentCategoryId: uuid, user: User): Promise<void> {
    if (!parentCategoryId) {
      return
    }
    if (parentCategoryId === id) {
      throw new BadRequestException('Circular reference caught when trying to set parentCategory.')
    }
    const parent = await this._getCategoryById(parentCategoryId, user)
    if (!parent) {
      this.logger.error(`Could not retrieve parent with ID "${parentCategoryId}".`)
      return
    } else {
      return await this._checkForCyclic(id, parent.parentCategoryId, user)
    }
  }
}
