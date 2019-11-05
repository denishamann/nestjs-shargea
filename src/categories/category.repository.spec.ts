import { Test } from '@nestjs/testing'
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto'
import { CategoryRepository } from './category.repository'
import { Like } from 'typeorm'
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { Category } from './category.entity'

const PG_FOREIGN_KEY_CONSTRAINT_VIOLATION = '23503'
const mockUser = {
  id: 'b3ad2d0f-89a3-43af-9a6c-891f4ca64197',
  email: 'denis@shargea.com',
}
const dummyId = 'b3ad2d0f-89a3-43af-9a6c-891f4ca64198'

describe('CategoryRepository', () => {
  let categoryRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoryRepository,
      ],
    }).compile()

    categoryRepository = await module.get<CategoryRepository>(CategoryRepository)
  })

  describe('getCategories', () => {
    beforeEach(() => {
      categoryRepository.find = jest.fn()
    })

    it('Should successfully find the categories, with no filters', async () => {
      categoryRepository.find.mockReturnValue('Some categories')
      expect(categoryRepository.find).not.toHaveBeenCalled()
      const result = await categoryRepository.getCategories({}, mockUser)
      expect(categoryRepository.find).toHaveBeenCalledWith({ where: { userId: mockUser.id } })
      expect(result).toEqual('Some categories')
    })
    it('Should successfully find the categories, with filters', async () => {
      const mockFilterDto: GetCategoriesFilterDto = { search: 'some search' }
      const mockWere = [
        {
          title: Like(`%some search%`),
          userId: mockUser.id,
        },
        {
          description: Like(`%some search%`),
          userId: mockUser.id,
        },
      ]
      categoryRepository.find.mockReturnValue('Some categories')
      expect(categoryRepository.find).not.toHaveBeenCalled()
      const result = await categoryRepository.getCategories(mockFilterDto, mockUser)
      expect(categoryRepository.find).toHaveBeenCalledWith({ where: mockWere })
      expect(result).toEqual('Some categories')
    })
    it('Should throw an error because an error has occured with the find method', async () => {
      categoryRepository.find.mockRejectedValue('unknown error')
      expect(categoryRepository.find).not.toHaveBeenCalled()
      await expect(categoryRepository.getCategories({}, mockUser)).rejects.toThrow(InternalServerErrorException)
      expect(categoryRepository.find).toHaveBeenCalledWith({ where: { userId: mockUser.id } })
    })
  })

  describe('createCategory', () => {
    it('Should save the category', async () => {
      const save = jest.fn().mockResolvedValue('Some category')
      const mockCategoryEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockCategoryEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      const result = await categoryRepository.createCategory('dto', mockUser)
      expect(global.Object.assign).toHaveBeenCalledWith(new Category(), 'dto', { user: mockUser })
      expect(save).toHaveBeenCalled()
      expect(result).toEqual('Some category')
      global.Object.assign = objAssign
    })
    it('Should throw an error because the mediaId and/or parentCategoryId provided is/are invalid', async () => {
      const error = {
        code: PG_FOREIGN_KEY_CONSTRAINT_VIOLATION,
      }
      const save = jest.fn().mockRejectedValue(error)
      const mockCategoryEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockCategoryEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      await expect(categoryRepository.createCategory('dto', mockUser)).rejects.toThrow(BadRequestException)
      expect(global.Object.assign).toHaveBeenCalledWith(new Category(), 'dto', { user: mockUser })
      expect(save).toHaveBeenCalled()
      global.Object.assign = objAssign
    })
    it('Should throw an error because an error has occured with the save method', async () => {
      const save = jest.fn().mockRejectedValue('unknown error')
      const mockCategoryEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockCategoryEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      await expect(categoryRepository.createCategory('dto', mockUser)).rejects.toThrow(InternalServerErrorException)
      expect(global.Object.assign).toHaveBeenCalledWith(new Category(), 'dto', { user: mockUser })
      expect(save).toHaveBeenCalled()
      global.Object.assign = objAssign
    })
  })

  describe('updateCategory', () => {
    it('Should update the category', async () => {
      const save = jest.fn().mockResolvedValue('Some category')
      const mockCategoryEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockCategoryEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      const result = await categoryRepository.updateCategory('category', 'dto')
      expect(global.Object.assign).toHaveBeenCalledWith('category', 'dto')
      expect(save).toHaveBeenCalled()
      expect(result).toEqual('Some category')
      global.Object.assign = objAssign
    })
    it('Should throw an error because the mediaId and/or parentCategoryId provided is/are invalid', async () => {
      const error = {
        code: PG_FOREIGN_KEY_CONSTRAINT_VIOLATION,
      }
      const save = jest.fn().mockRejectedValue(error)
      const mockCategoryEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockCategoryEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      await expect(categoryRepository.updateCategory('category', 'dto')).rejects.toThrow(BadRequestException)
      expect(global.Object.assign).toHaveBeenCalledWith('category', 'dto')
      expect(save).toHaveBeenCalled()
      global.Object.assign = objAssign
    })
    it('Should throw an error because an error has occured with the save method', async () => {
      const save = jest.fn().mockRejectedValue('unknown error')
      const mockCategoryEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockCategoryEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      await expect(categoryRepository.updateCategory('category', 'dto')).rejects.toThrow(InternalServerErrorException)
      expect(global.Object.assign).toHaveBeenCalledWith('category', 'dto')
      expect(save).toHaveBeenCalled()
      global.Object.assign = objAssign
    })
  })
  describe('deleteCategory', () => {
    it('Should delete the category', async () => {
      const mockDeleteResult = {
        affected: 1,
      }
      categoryRepository.delete = jest.fn().mockReturnValue(mockDeleteResult)

      expect(categoryRepository.delete).not.toHaveBeenCalled()
      await categoryRepository.deleteCategory(dummyId, mockUser)
      expect(categoryRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
    })
    it('Should throw an error because the category is not found', async () => {
      const mockDeleteResult = {
        affected: 0,
      }
      categoryRepository.delete = jest.fn().mockReturnValue(mockDeleteResult)

      expect(categoryRepository.delete).not.toHaveBeenCalled()
      await expect(categoryRepository.deleteCategory(dummyId, mockUser)).rejects.toThrow(NotFoundException)
      expect(categoryRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
    })
    it('Should throw an error because the category is still referenced', async () => {
      const mockError = {
        code: PG_FOREIGN_KEY_CONSTRAINT_VIOLATION,
      }
      categoryRepository.delete = jest.fn().mockRejectedValue(mockError)

      expect(categoryRepository.delete).not.toHaveBeenCalled()
      await expect(categoryRepository.deleteCategory(dummyId, mockUser)).rejects.toThrow(BadRequestException)
      expect(categoryRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
    })
    it('Should throw an error because because an error has occured with the delete method', async () => {
      categoryRepository.delete = jest.fn().mockRejectedValue('unknown error')

      expect(categoryRepository.delete).not.toHaveBeenCalled()
      await expect(categoryRepository.deleteCategory(dummyId, mockUser)).rejects.toThrow(InternalServerErrorException)
      expect(categoryRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
    })
  })
})
