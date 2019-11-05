import { Test } from '@nestjs/testing'
import { MediaService } from './media.service'
import { MediaRepository } from './media.repository'
import { NotFoundException } from '@nestjs/common'
import { Media } from './media.entity'
import { UpdateMediaDto } from './dto/update-media.dto'

const mockUser = {
  id: 'b3ad2d0f-89a3-43af-9a6c-891f4ca64197',
  email: 'denis@shargea.com',
}
const dummyId = 'b3ad2d0f-89a3-43af-9a6c-891f4ca64198'

const mockMediaRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  deleteMedia: jest.fn(),
})

describe('MediaService', () => {
  let mediaService
  let mediaRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MediaService,
        { provide: MediaRepository, useFactory: mockMediaRepository },
      ],
    }).compile()

    mediaService = await module.get<MediaService>(MediaService)
    mediaRepository = await module.get<MediaRepository>(MediaRepository)
  })
  describe('getAllMedia', () => {
    it('should get all media from the repository', async () => {
      mediaRepository.find.mockResolvedValue('Some value')

      expect(mediaRepository.find).not.toHaveBeenCalled()
      const result = await mediaService.getAllMedia(mockUser)
      expect(mediaRepository.find).toHaveBeenCalledWith({ where: { userId: mockUser.id } })
      expect(result).toEqual('Some value')
    })
  })
  describe('getMediaById', () => {
    it('should call the repository, retrieve the media, and return it', async () => {
      mediaRepository.findOne.mockResolvedValue('Some value')

      expect(mediaRepository.findOne).not.toHaveBeenCalled()
      const result = await mediaService.getMediaById(dummyId, mockUser)
      expect(mediaRepository.findOne).toHaveBeenCalledWith({ where: { id: dummyId, userId: mockUser.id } })
      expect(result).toEqual('Some value')
    })

    it('should throw an error because the media could not be found', async () => {
      mediaRepository.findOne.mockResolvedValue(null)

      expect(mediaRepository.findOne).not.toHaveBeenCalled()
      await expect(mediaService.getMediaById(dummyId, mockUser)).rejects.toThrow(NotFoundException)
      expect(mediaRepository.findOne).toHaveBeenCalled()
    })
  })
  describe('createMedia', () => {
    it('should create a new media entity, assign new values, save it and return it', async () => {
      const save = jest.fn().mockResolvedValue('Some value')
      const mockObj = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockObj)
      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      const result = await mediaService.createMedia('dto', 'user')
      expect(global.Object.assign).toHaveBeenCalledWith(new Media(), 'dto', { user: 'user' })
      expect(save).toHaveBeenCalled()
      expect(result).toEqual('Some value')
      global.Object.assign = objAssign
    })
  })
  describe('updateMedia', () => {
    it('should retrieve the media, assign new values, save it and return it', async () => {
      const save = jest.fn().mockResolvedValue('Some value')
      const mockObj = {
        save,
      }
      const updateMediaDto: UpdateMediaDto = {
        title: 'Updated title',
      }
      mediaService.getMediaById = jest.fn().mockResolvedValue('Some value')
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockObj)

      expect(mediaService.getMediaById).not.toHaveBeenCalled()
      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      const result = await mediaService.updateMedia(dummyId, updateMediaDto, 'user')
      expect(mediaService.getMediaById).toHaveBeenCalledWith(dummyId, 'user')
      expect(global.Object.assign).toHaveBeenCalledWith('Some value', updateMediaDto)
      expect(save).toHaveBeenCalled()
      expect(result).toEqual('Some value')
      expect(true).toEqual(true)
      global.Object.assign = objAssign
    })
    it('should not update the media and act as a get because the dto is empty', async () => {
      const save = jest.fn().mockResolvedValue('Some value')
      const mockObj = {
        save,
      }
      const updateMediaDto: UpdateMediaDto = {}
      mediaService.getMediaById = jest.fn().mockResolvedValue('Some value')
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockObj)

      expect(mediaService.getMediaById).not.toHaveBeenCalled()
      const result = await mediaService.updateMedia(dummyId, updateMediaDto, 'user')
      expect(mediaService.getMediaById).toHaveBeenCalledWith(dummyId, 'user')
      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      expect(result).toEqual('Some value')
      expect(true).toEqual(true)
      global.Object.assign = objAssign
    })
  })
  describe('deleteMedia', () => {
    it('should call the repository to delete the media', async () => {
      mediaRepository.deleteMedia.mockResolvedValue('Some value')

      expect(mediaRepository.deleteMedia).not.toHaveBeenCalled()
      await mediaService.deleteMedia(dummyId, mockUser)
      expect(mediaRepository.deleteMedia).toHaveBeenCalledWith(dummyId, mockUser)
      expect(true).toEqual(true)
    })
  })
})
