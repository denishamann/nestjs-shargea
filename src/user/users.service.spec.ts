import { Test } from '@nestjs/testing'
import { UsersService } from './users.service'
import { UserRepository } from './user.repository'
import { MediaService } from '../media/media.service'
import { UpdateUserDto } from './update-user.dto'
import { CategoriesService } from '../categories/categories.service'

const dummyId = 'b3ad2d0f-89a3-43af-9a6c-891f4ca64198'
const anotherDummyId = 'b3ad2d0f-89a3-43af-9a6c-891f4ca64199'

const mockUserRepository = () => ({
  findOne: jest.fn(),
  signUp: jest.fn(),
  validatePassword: jest.fn(),
  delete: jest.fn(),
  updateUser: jest.fn(),
})

const mockMediaService = () => ({
  deleteMedia: jest.fn(),
  getMediaById: jest.fn(),
})

const mockCategoriesService = () => ({
  getCategoryById: jest.fn(),
})

describe('UsersService', () => {
  let usersService
  let userRepository
  let mediaService
  let categoriesService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        MediaService,
        CategoriesService,
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: MediaService, useFactory: mockMediaService },
        { provide: CategoriesService, useFactory: mockCategoriesService },
      ],
    }).compile()

    usersService = await module.get<UsersService>(UsersService)
    userRepository = await module.get<UserRepository>(UserRepository)
    mediaService = await module.get<MediaService>(MediaService)
    categoriesService = await module.get<CategoriesService>(CategoriesService)

  })
  describe('findOne', () => {
    it('should call findOne on the repository', async () => {
      userRepository.findOne.mockResolvedValue('Some value')

      expect(userRepository.findOne).not.toHaveBeenCalled()
      const result = await usersService.findOne('Some email')
      expect(userRepository.findOne).toHaveBeenCalledWith({ email: 'Some email' })
      expect(result).toEqual('Some value')
    })
  })
  describe('signUp', () => {
    it('should call signUp on the repository', async () => {
      userRepository.signUp.mockResolvedValue('Some value')

      expect(userRepository.signUp).not.toHaveBeenCalled()
      const result = await usersService.signUp('Auth dto')
      expect(userRepository.signUp).toHaveBeenCalledWith('Auth dto')
      expect(result).toEqual('Some value')
    })
  })
  describe('validatePassword', () => {
    it('should call validatePassword on the repository', async () => {
      userRepository.validatePassword.mockResolvedValue('Some value')

      expect(userRepository.validatePassword).not.toHaveBeenCalled()
      const result = await usersService.validatePassword('Auth dto')
      expect(userRepository.validatePassword).toHaveBeenCalledWith('Auth dto')
      expect(result).toEqual('Some value')
    })
  })
  describe('updateUser', () => {
    it('should call updateUser on the repository since the dto is not empty, image does not changed', async () => {
      const mockUserBeforeUpdate = {
        pictureId: dummyId,
      }
      const mockUpdateUserDto: UpdateUserDto = {
        defaultCategoryId: anotherDummyId,
      }
      userRepository.updateUser.mockResolvedValue('Some value')

      expect(userRepository.updateUser).not.toHaveBeenCalled()
      expect(mediaService.getMediaById).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      expect(categoriesService.getCategoryById).not.toHaveBeenCalled()
      const result = await usersService.updateUser(mockUpdateUserDto, mockUserBeforeUpdate)
      expect(userRepository.updateUser).toHaveBeenCalledWith(mockUpdateUserDto, mockUserBeforeUpdate)
      expect(categoriesService.getCategoryById).toHaveBeenCalledWith(anotherDummyId, mockUserBeforeUpdate)
      expect(mediaService.getMediaById).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      expect(result).toEqual('Some value')
    })
    it('should not update the user and act as a get because the dto is empty', async () => {
      const mockUpdateUserDto: UpdateUserDto = {}

      const result = await usersService.updateUser(mockUpdateUserDto, 'user')
      expect(userRepository.updateUser).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      expect(result).toEqual('user')

    })
    it('should call updateUser on the repository, image changed', async () => {
      const mockUserBeforeUpdate = {
        pictureId: dummyId,
      }
      const mockUpdateUserDto: UpdateUserDto = {
        pictureId: anotherDummyId,
      }
      userRepository.updateUser.mockResolvedValue('Some value')

      expect(userRepository.updateUser).not.toHaveBeenCalled()
      expect(mediaService.getMediaById).not.toHaveBeenCalled()
      expect(categoriesService.getCategoryById).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      const result = await usersService.updateUser(mockUpdateUserDto, mockUserBeforeUpdate)
      expect(userRepository.updateUser).toHaveBeenCalledWith(mockUpdateUserDto, mockUserBeforeUpdate)
      expect(categoriesService.getCategoryById).not.toHaveBeenCalled()
      expect(mediaService.getMediaById).toHaveBeenCalledWith(anotherDummyId, mockUserBeforeUpdate)
      expect(mediaService.deleteMedia).toHaveBeenCalledWith(mockUserBeforeUpdate.pictureId, mockUserBeforeUpdate)
      expect(result).toEqual('Some value')
    })
    it('should call updateUser on the repository, image is set to null so it must be deleted', async () => {
      const mockUserBeforeUpdate = {
        pictureId: dummyId,
      }
      const mockUpdateUserDto: UpdateUserDto = {
        pictureId: null,
      }
      userRepository.updateUser.mockResolvedValue('Some value')

      expect(userRepository.updateUser).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      const result = await usersService.updateUser(mockUpdateUserDto, mockUserBeforeUpdate)
      expect(userRepository.updateUser).toHaveBeenCalledWith(mockUpdateUserDto, mockUserBeforeUpdate)
      expect(mediaService.deleteMedia).toHaveBeenCalledWith(mockUserBeforeUpdate.pictureId, mockUserBeforeUpdate)
      expect(result).toEqual('Some value')
    })
  })
  describe('deleteUser', () => {
    it('should call deleteUser on the repository', async () => {
      expect(userRepository.delete).not.toHaveBeenCalled()
      await usersService.deleteUser(dummyId)
      expect(userRepository.delete).toHaveBeenCalledWith({ id: dummyId })
    })
  })
})
