import { Test } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CategoryRepository } from './category.repository'
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { MediaService } from '../media/media.service'
import { UpdateCategoryDto } from './dto/update-category.dto'

const mockUser = {
  id: 'b3ad2d0f-89a3-43af-9a6c-891f4ca64197',
  email: 'denis@shargea.com',
}
const dummyId = 'b3ad2d0f-89a3-43af-9a6c-891f4ca64198'
const anotherDummyId = 'b3ad2d0f-89a3-43af-9a6c-891f4ca64199'
const yetAnotherDummyId = 'b3ad2d0f-89a3-43af-9a6c-891f4ca64190'

const mockCategoryRepository = () => ({
  getCategories: jest.fn(),
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
  findOne: jest.fn(),
})
const mockMediaService = () => ({
  deleteMedia: jest.fn(),
})
describe('CategoriesService', () => {
  let categoriesService
  let categoryRepository
  let mediaService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoriesService,
        MediaService,
        { provide: CategoryRepository, useFactory: mockCategoryRepository },
        { provide: MediaService, useFactory: mockMediaService },
      ],
    }).compile()

    categoriesService = await module.get<CategoriesService>(CategoriesService)
    categoryRepository = await module.get<CategoryRepository>(CategoryRepository)
    mediaService = await module.get<MediaService>(MediaService)
  })

  describe('getCategories', () => {
    it('should get all categories from the repository', async () => {
      const filters: GetCategoriesFilterDto = {
        search: 'Some search query',
      }
      categoryRepository.getCategories.mockResolvedValue('Some value')

      expect(categoryRepository.getCategories).not.toHaveBeenCalled()
      const result = await categoriesService.getCategories(filters, mockUser)
      expect(categoryRepository.getCategories).toHaveBeenCalledWith(filters, mockUser)
      expect(result).toEqual('Some value')
    })
  })

  describe('getCategoryById', () => {
    it('should call _getCategoryById() to retrieve the category and return it', async () => {
      categoriesService._getCategoryById = jest.fn().mockResolvedValue('Some value')

      expect(categoriesService._getCategoryById).not.toHaveBeenCalled()
      const result = await categoriesService.getCategoryById(dummyId, mockUser)
      expect(categoriesService._getCategoryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(result).toEqual('Some value')
    })

    it('should throw an error because the category could not be found', async () => {
      categoriesService._getCategoryById = jest.fn().mockResolvedValue(null)

      expect(categoriesService._getCategoryById).not.toHaveBeenCalled()
      await expect(categoriesService.getCategoryById(dummyId, mockUser)).rejects.toThrow(NotFoundException)
      expect(categoriesService._getCategoryById).toHaveBeenCalledWith(dummyId, mockUser)
    })
  })

  describe('_getCategoryById', () => {
    it('should call the repository, retrieve the category, and return it', async () => {
      const mockCategory = {
        title: 'Dummy title',
      }
      categoryRepository.findOne.mockResolvedValue(mockCategory)

      expect(categoryRepository.findOne).not.toHaveBeenCalled()
      const result = await categoriesService._getCategoryById(dummyId, mockUser)
      expect(categoryRepository.findOne).toHaveBeenCalledWith({ where: { id: dummyId, userId: mockUser.id } })
      expect(result).toEqual(mockCategory)
    })
  })

  describe('createCategory', () => {
    it('should call the repository, create the category, and return it', async () => {
      const mockCreateCategoryDto: CreateCategoryDto = {
        title: 'Dummy title',
      }
      categoryRepository.createCategory.mockResolvedValue('Some category')

      expect(categoryRepository.createCategory).not.toHaveBeenCalled()
      const result = await categoriesService.createCategory(mockCreateCategoryDto, mockUser)
      expect(categoryRepository.createCategory).toHaveBeenCalledWith(mockCreateCategoryDto, mockUser)
      expect(result).toEqual('Some category')
    })
  })

  describe('updateCategory', () => {
    it('should retrieve category from repository to update it and return it, image does not change', async () => {
      const mockCategory = {
        title: 'Dummy title',
      }
      const mockUpdateCategoryDto: UpdateCategoryDto = {
        title: 'Dummy updated title',
      }

      categoriesService.getCategoryById = jest.fn().mockResolvedValue(mockCategory)
      categoriesService._checkForCyclic = jest.fn().mockResolvedValue(null)
      categoryRepository.updateCategory.mockResolvedValue('Some category')

      expect(categoriesService.getCategoryById).not.toHaveBeenCalled()
      expect(categoriesService._checkForCyclic).not.toHaveBeenCalled()
      expect(categoryRepository.updateCategory).not.toHaveBeenCalled()

      const result = await categoriesService.updateCategory(dummyId, mockUpdateCategoryDto, mockUser)

      expect(categoriesService.getCategoryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(categoriesService._checkForCyclic).toHaveBeenCalledWith(dummyId, undefined, mockUser)
      expect(categoryRepository.updateCategory).toHaveBeenCalledWith(mockCategory, mockUpdateCategoryDto)
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      expect(result).toEqual('Some category')
    })

    it('should retrieve category from repository to update it and return it, image changed', async () => {
      const mockCategory = {
        imageId: anotherDummyId,
      }
      const mockUpdateCategoryDto: UpdateCategoryDto = {
        imageId: yetAnotherDummyId,
      }
      categoriesService.getCategoryById = jest.fn().mockResolvedValue(mockCategory)
      categoriesService._checkForCyclic = jest.fn().mockResolvedValue(null)
      categoryRepository.updateCategory.mockResolvedValue('Some category')

      expect(categoriesService.getCategoryById).not.toHaveBeenCalled()
      expect(categoriesService._checkForCyclic).not.toHaveBeenCalled()
      expect(categoryRepository.updateCategory).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()

      const result = await categoriesService.updateCategory(dummyId, mockUpdateCategoryDto, mockUser)

      expect(categoriesService.getCategoryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(categoriesService._checkForCyclic).toHaveBeenCalledWith(dummyId, undefined, mockUser)
      expect(categoryRepository.updateCategory).toHaveBeenCalledWith(mockCategory, mockUpdateCategoryDto)
      expect(mediaService.deleteMedia).toHaveBeenCalledWith(anotherDummyId, mockUser)
      expect(result).toEqual('Some category')
    })

    it('should retrieve category from repository to updateit and return it, image is set to null so it must be deleted', async () => {
      const mockCategory = {
        imageId: anotherDummyId,
      }
      const mockUpdateCategoryDto: UpdateCategoryDto = {
        imageId: null,
      }
      categoriesService.getCategoryById = jest.fn().mockResolvedValue(mockCategory)
      categoriesService._checkForCyclic = jest.fn().mockResolvedValue(null)
      categoryRepository.updateCategory.mockResolvedValue('Some category')

      expect(categoriesService.getCategoryById).not.toHaveBeenCalled()
      expect(categoriesService._checkForCyclic).not.toHaveBeenCalled()
      expect(categoryRepository.updateCategory).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()

      const result = await categoriesService.updateCategory(dummyId, mockUpdateCategoryDto, mockUser)

      expect(categoriesService.getCategoryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(categoriesService._checkForCyclic).toHaveBeenCalledWith(dummyId, undefined, mockUser)
      expect(categoryRepository.updateCategory).toHaveBeenCalledWith(mockCategory, mockUpdateCategoryDto)
      expect(mediaService.deleteMedia).toHaveBeenCalledWith(anotherDummyId, mockUser)
      expect(result).toEqual('Some category')
    })

    it('should not update the category and act as a get because the dto is empty', async () => {
      const mockUpdateCategoryDto: UpdateCategoryDto = {}
      categoriesService.getCategoryById = jest.fn().mockResolvedValue('Some category')
      categoriesService._checkForCyclic = jest.fn()

      expect(categoriesService.getCategoryById).not.toHaveBeenCalled()

      const result = await categoriesService.updateCategory(dummyId, mockUpdateCategoryDto, mockUser)

      expect(categoriesService.getCategoryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(categoriesService._checkForCyclic).not.toHaveBeenCalled()
      expect(categoryRepository.updateCategory).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      expect(result).toEqual('Some category')
    })

    it('should throw an error because there is a circular dependency', async () => {
      const mockCategory = {
        imageId: anotherDummyId,
      }
      const mockUpdateCategoryDto: UpdateCategoryDto = {
        parentCategoryId: yetAnotherDummyId,
      }
      categoriesService.getCategoryById = jest.fn().mockResolvedValue(mockCategory)
      categoriesService._checkForCyclic = jest.fn().mockRejectedValue(new BadRequestException())

      expect(categoriesService.getCategoryById).not.toHaveBeenCalled()
      expect(categoriesService._checkForCyclic).not.toHaveBeenCalled()

      await expect(categoriesService.updateCategory(dummyId, mockUpdateCategoryDto, mockUser)).rejects.toThrow(BadRequestException)

      expect(categoriesService.getCategoryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(categoriesService._checkForCyclic).toHaveBeenCalledWith(dummyId, yetAnotherDummyId, mockUser)
      expect(categoryRepository.updateCategory).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()

    })
  })

  describe('_checkForCyclic', () => {
    it('should not throw any error because there is no parentCategoryId provided', async () => {
      categoriesService._getCategoryById = jest.fn()

      await categoriesService._checkForCyclic(dummyId, undefined, mockUser)
      expect(categoriesService._getCategoryById).not.toHaveBeenCalled()
    })
    it('should not throw any error because we could not retrieve the parent', async () => {
      categoriesService._getCategoryById = jest.fn().mockResolvedValue(null)

      expect(categoriesService._getCategoryById).not.toHaveBeenCalled()
      await categoriesService._checkForCyclic(dummyId, anotherDummyId, mockUser)
      expect(categoriesService._getCategoryById).toHaveBeenCalledWith(anotherDummyId, mockUser)
    })
    it('should not throw any error because there is no cycle', async () => {
      const mockParent = {
        parentCategoryId: yetAnotherDummyId,
      }
      const mockGrandParent = {
        parentCategoryId: null,
      }
      let index = 0
      categoriesService._getCategoryById = jest.fn(() => {
        if (index === 0) {
          index++
          return mockParent
        } else {
          return mockGrandParent
        }
      })
      expect(categoriesService._getCategoryById).not.toHaveBeenCalled()
      await categoriesService._checkForCyclic(dummyId, anotherDummyId, mockUser)
      expect(categoriesService._getCategoryById).toHaveBeenCalledTimes(2)
    })
    it('should throw an error because the parentCategoryId is the current category id', async () => {
      categoriesService._getCategoryById = jest.fn()

      await expect(categoriesService._checkForCyclic(dummyId, dummyId, mockUser)).rejects.toThrow(BadRequestException)
      expect(categoriesService._getCategoryById).not.toHaveBeenCalled()
    })
    it('should throw an error because the parent has the current category as parent', async () => {
      const mockParent = {
        parentCategoryId: dummyId,
      }
      categoriesService._getCategoryById = jest.fn().mockResolvedValue(mockParent)

      expect(categoriesService._getCategoryById).not.toHaveBeenCalled()
      await expect(categoriesService._checkForCyclic(dummyId, anotherDummyId, mockUser)).rejects.toThrow(BadRequestException)
      expect(categoriesService._getCategoryById).toHaveBeenCalledWith(anotherDummyId, mockUser)
    })
    it('should throw an error because there is a circle', async () => {
      const mockParent = {
        parentCategoryId: yetAnotherDummyId,
      }
      const mockGrandParent = {
        parentCategoryId: dummyId,
      }
      let index = 0
      categoriesService._getCategoryById = jest.fn(() => {
        if (index === 0) {
          index++
          return mockParent
        } else {
          return mockGrandParent
        }
      })
      expect(categoriesService._getCategoryById).not.toHaveBeenCalled()
      await expect(categoriesService._checkForCyclic(dummyId, anotherDummyId, mockUser)).rejects.toThrow(BadRequestException)
      expect(categoriesService._getCategoryById).toHaveBeenCalledTimes(2)
    })
  })
  describe('deleteCategory', () => {
    it('should retrieve the category, call the repository to delete it, and delete the linked media', async () => {
      const mockCategory = {
        imageId: anotherDummyId,
      }
      categoriesService.getCategoryById = jest.fn().mockResolvedValue(mockCategory)

      expect(categoriesService.getCategoryById).not.toHaveBeenCalled()
      expect(categoryRepository.deleteCategory).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      await categoriesService.deleteCategory(dummyId, mockUser)
      expect(categoriesService.getCategoryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(categoryRepository.deleteCategory).toHaveBeenCalledWith(dummyId, mockUser)
      expect(mediaService.deleteMedia).toHaveBeenCalledWith(anotherDummyId, mockUser)
    })

    it('should retrieve the category that has no media, call the repository to delete it', async () => {
      const mockCategory = {}
      categoriesService.getCategoryById = jest.fn().mockResolvedValue(mockCategory)

      expect(categoriesService.getCategoryById).not.toHaveBeenCalled()
      expect(categoryRepository.deleteCategory).not.toHaveBeenCalled()
      await categoriesService.deleteCategory(dummyId, mockUser)
      expect(categoriesService.getCategoryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(categoryRepository.deleteCategory).toHaveBeenCalledWith(dummyId, mockUser)
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
    })

    it('should retrieve the category, call the repository to delete it, and catch the error because the image could not be deleted', async () => {
      const mockCategory = {
        imageId: anotherDummyId,
      }
      categoriesService.getCategoryById = jest.fn().mockResolvedValue(mockCategory)
      mediaService.deleteMedia.mockRejectedValue('Dummy error')

      expect(categoriesService.getCategoryById).not.toHaveBeenCalled()
      expect(categoryRepository.deleteCategory).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      await categoriesService.deleteCategory(dummyId, mockUser)
      expect(categoriesService.getCategoryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(categoryRepository.deleteCategory).toHaveBeenCalledWith(dummyId, mockUser)
      expect(mediaService.deleteMedia).toHaveBeenCalledWith(anotherDummyId, mockUser)
    })
  })
})
