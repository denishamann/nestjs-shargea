import { Test } from '@nestjs/testing'
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { MediaRepository } from './media.repository'

const PG_FOREIGN_KEY_CONSTRAINT_VIOLATION = '23503'
const mockUser = {
  id: 'b3ad2d0f-89a3-43af-9a6c-891f4ca64197',
  email: 'denis@shargea.com',
}
const dummyId = 'b3ad2d0f-89a3-43af-9a6c-891f4ca64198'

describe('MediaRepository', () => {
  let mediaRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MediaRepository,
      ],
    }).compile()

    mediaRepository = await module.get<MediaRepository>(MediaRepository)
  })

  describe('deleteMedia', () => {
    it('Should delete the media', async () => {
      const mockDeleteResult = {
        affected: 1,
      }
      mediaRepository.delete = jest.fn().mockReturnValue(mockDeleteResult)

      expect(mediaRepository.delete).not.toHaveBeenCalled()
      await mediaRepository.deleteMedia(dummyId, mockUser)
      expect(mediaRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
    })
    it('Should throw an error because the media is not found', async () => {
      const mockDeleteResult = {
        affected: 0,
      }
      mediaRepository.delete = jest.fn().mockReturnValue(mockDeleteResult)

      expect(mediaRepository.delete).not.toHaveBeenCalled()
      await expect(mediaRepository.deleteMedia(dummyId, mockUser)).rejects.toThrow(NotFoundException)
      expect(mediaRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
    })
    it('Should throw an error because the media is still referenced', async () => {
      const mockError = {
        code: PG_FOREIGN_KEY_CONSTRAINT_VIOLATION,
      }
      mediaRepository.delete = jest.fn().mockRejectedValue(mockError)

      expect(mediaRepository.delete).not.toHaveBeenCalled()
      await expect(mediaRepository.deleteMedia(dummyId, mockUser)).rejects.toThrow(BadRequestException)
      expect(mediaRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
    })
    it('Should throw an error because because an error has occured with the delete method', async () => {
      mediaRepository.delete = jest.fn().mockRejectedValue('unknown error')

      expect(mediaRepository.delete).not.toHaveBeenCalled()
      await expect(mediaRepository.deleteMedia(dummyId, mockUser)).rejects.toThrow(InternalServerErrorException)
      expect(mediaRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
    })
  })
})
