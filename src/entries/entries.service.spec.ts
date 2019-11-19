import { Test } from '@nestjs/testing'
import { MediaService } from '../media/media.service'
import { EntriesService } from './entries.service'
import { EntryRepository } from './entry.repository'
import { GetEntriesFilterDto } from './dto/get-entries-filter.dto'
import { NotFoundException } from '@nestjs/common'
import { CreateEntryDto } from './dto/create-entry.dto'
import { UpdateEntryDto } from './dto/update-entry.dto'
import { CategoriesService } from '../categories/categories.service'

const mockUser = {
  id: 'b3ad2d0f-89a3-43af-9a6c-891f4ca64197',
  email: 'denis@shargea.com',
}
const dummyId = 'b3ad2d0f-89a3-43af-9a6c-891f4ca64198'
const anotherDummyId = 'b3ad2d0f-89a3-43af-9a6c-891f4ca64199'
const yetAnotherDummyId = 'b3ad2d0f-89a3-43af-9a6c-891f4ca64190'

const mockEntryRepository = () => ({
  getEntries: jest.fn(),
  findOne: jest.fn(),
  createEntry: jest.fn(),
  updateEntry: jest.fn(),
  delete: jest.fn(),
})
const mockMediaService = () => ({
  deleteMedia: jest.fn(),
  getMediaById: jest.fn(),
})
const mockCategoriesService = () => ({})

describe('EntriesService', () => {
  let entriesService
  let entryRepository
  let mediaService
  let categoriesService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntriesService,
        MediaService,
        CategoriesService,
        { provide: EntryRepository, useFactory: mockEntryRepository },
        { provide: MediaService, useFactory: mockMediaService },
        { provide: CategoriesService, useFactory: mockCategoriesService },
      ],
    }).compile()

    entriesService = await module.get<EntriesService>(EntriesService)
    entryRepository = await module.get<EntryRepository>(EntryRepository)
    mediaService = await module.get<MediaService>(MediaService)
    categoriesService = await module.get<CategoriesService>(CategoriesService)

  })

  describe('getEntries', () => {
    it('should get all categories from the repository', async () => {
      const filters: GetEntriesFilterDto = {
        search: 'Some search query',
      }
      entryRepository.getEntries.mockResolvedValue('Some value')

      expect(entryRepository.getEntries).not.toHaveBeenCalled()
      const result = await entriesService.getEntries(filters, mockUser)
      expect(entryRepository.getEntries).toHaveBeenCalledWith(filters, mockUser)
      expect(result).toEqual('Some value')
    })
  })
  describe('getEntryById', () => {
    it('should call the repository to retrieve the entry and return it', async () => {
      entryRepository.findOne = jest.fn().mockResolvedValue('Some value')

      expect(entryRepository.findOne).not.toHaveBeenCalled()
      const result = await entriesService.getEntryById(dummyId, mockUser)
      expect(entryRepository.findOne).toHaveBeenCalledWith({ where: { id: dummyId, userId: mockUser.id } })
      expect(result).toEqual('Some value')
    })
    it('should throw an error because the category could not be found', async () => {
      entryRepository.findOne = jest.fn().mockResolvedValue(null)

      expect(entryRepository.findOne).not.toHaveBeenCalled()
      await expect(entriesService.getEntryById(dummyId, mockUser)).rejects.toThrow(NotFoundException)
      expect(entryRepository.findOne).toHaveBeenCalledWith({ where: { id: dummyId, userId: mockUser.id } })
    })
  })
  describe('createEntry', () => {
    it('should call the repository, create the entry, and return it', async () => {
      const mockCreateEntryDto: CreateEntryDto = {
        title: 'Dummy title',
        amount: 13.87,
      }
      entryRepository.createEntry.mockResolvedValue('Some category')

      expect(entryRepository.createEntry).not.toHaveBeenCalled()
      const result = await entriesService.createEntry(mockCreateEntryDto, mockUser)
      expect(entryRepository.createEntry).toHaveBeenCalledWith(mockCreateEntryDto, mockUser)
      expect(result).toEqual('Some category')
    })
  })
  describe('updateEntry', () => {
    it('should retrieve entry from repository to update it and return it, image does not change', async () => {
      const mockEntry = {
        title: 'Dummy title',
      }
      const mockUpdateEntryDto: UpdateEntryDto = {
        title: 'Dummy updated title',
      }

      entriesService.getEntryById = jest.fn().mockResolvedValue(mockEntry)
      entryRepository.updateEntry.mockResolvedValue('Some entry')

      expect(entriesService.getEntryById).not.toHaveBeenCalled()
      expect(entryRepository.updateEntry).not.toHaveBeenCalled()

      const result = await entriesService.updateEntry(dummyId, mockUpdateEntryDto, mockUser)

      expect(entriesService.getEntryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(entryRepository.updateEntry).toHaveBeenCalledWith(mockEntry, mockUpdateEntryDto)
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      expect(result).toEqual('Some entry')
    })
    it('should retrieve entry from repository to update it and return it, image changed', async () => {
      const mockEntry = {
        imageId: anotherDummyId,
      }
      const mockUpdateEntryDto: UpdateEntryDto = {
        imageId: yetAnotherDummyId,
      }
      entriesService.getEntryById = jest.fn().mockResolvedValue(mockEntry)
      entryRepository.updateEntry.mockResolvedValue('Some entry')

      expect(entriesService.getEntryById).not.toHaveBeenCalled()
      expect(entryRepository.updateEntry).not.toHaveBeenCalled()
      expect(mediaService.getMediaById).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()

      const result = await entriesService.updateEntry(dummyId, mockUpdateEntryDto, mockUser)

      expect(entriesService.getEntryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(entryRepository.updateEntry).toHaveBeenCalledWith(mockEntry, mockUpdateEntryDto)
      expect(mediaService.getMediaById).toHaveBeenCalledWith(yetAnotherDummyId, mockUser)
      expect(mediaService.deleteMedia).toHaveBeenCalledWith(anotherDummyId, mockUser)
      expect(result).toEqual('Some entry')
    })
    it('should retrieve entry from repository to updateit and return it, image is set to null so it must be deleted', async () => {
      const mockEntry = {
        imageId: anotherDummyId,
      }
      const mockUpdateEntryDto: UpdateEntryDto = {
        imageId: null,
      }
      entriesService.getEntryById = jest.fn().mockResolvedValue(mockEntry)
      entryRepository.updateEntry.mockResolvedValue('Some entry')

      expect(entriesService.getEntryById).not.toHaveBeenCalled()
      expect(entryRepository.updateEntry).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()

      const result = await entriesService.updateEntry(dummyId, mockUpdateEntryDto, mockUser)

      expect(entriesService.getEntryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(entryRepository.updateEntry).toHaveBeenCalledWith(mockEntry, mockUpdateEntryDto)
      expect(mediaService.deleteMedia).toHaveBeenCalledWith(anotherDummyId, mockUser)
      expect(result).toEqual('Some entry')
    })
    it('should not update the entry and act as a get because the dto is empty', async () => {
      const mockUpdateEntryDto: UpdateEntryDto = {}
      entriesService.getEntryById = jest.fn().mockResolvedValue('Some entry')

      expect(entriesService.getEntryById).not.toHaveBeenCalled()

      const result = await entriesService.updateEntry(dummyId, mockUpdateEntryDto, mockUser)

      expect(entriesService.getEntryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(entryRepository.updateEntry).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      expect(result).toEqual('Some entry')
    })
  })
  describe('delete', () => {
    it('should retrieve the entry, call the repository to delete it, and delete the linked media', async () => {
      const mockEntry = {
        imageId: anotherDummyId,
      }
      const mockResult = {
        affected: 1,
      }
      entryRepository.delete.mockResolvedValue(mockResult)
      entriesService.getEntryById = jest.fn().mockResolvedValue(mockEntry)

      expect(entriesService.getEntryById).not.toHaveBeenCalled()
      expect(entryRepository.delete).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      await entriesService.deleteEntry(dummyId, mockUser)
      expect(entriesService.getEntryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(entryRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
      expect(mediaService.deleteMedia).toHaveBeenCalledWith(anotherDummyId, mockUser)
    })
    it('should retrieve the entry that has no media, call the repository to delete it', async () => {
      const mockEntry = {}
      const mockResult = {
        affected: 1,
      }
      entryRepository.delete.mockResolvedValue(mockResult)
      entriesService.getEntryById = jest.fn().mockResolvedValue(mockEntry)

      expect(entriesService.getEntryById).not.toHaveBeenCalled()
      expect(entryRepository.delete).not.toHaveBeenCalled()
      await entriesService.deleteEntry(dummyId, mockUser)
      expect(entriesService.getEntryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(entryRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
    })
    it('should retrieve the entry, call the repository to delete it, and catch the error because the image could not be deleted', async () => {
      const mockEntry = {
        imageId: anotherDummyId,
      }
      const mockResult = {
        affected: 1,
      }
      entryRepository.delete.mockResolvedValue(mockResult)
      entriesService.getEntryById = jest.fn().mockResolvedValue(mockEntry)
      mediaService.deleteMedia.mockRejectedValue('Dummy error')

      expect(entriesService.getEntryById).not.toHaveBeenCalled()
      expect(entryRepository.delete).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      await entriesService.deleteEntry(dummyId, mockUser)
      expect(entriesService.getEntryById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(entryRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
      expect(mediaService.deleteMedia).toHaveBeenCalledWith(anotherDummyId, mockUser)
    })
    it('should throw an error because entry could not be found', async () => {
      const mockResult = {
        affected: 0,
      }
      entryRepository.delete.mockResolvedValue(mockResult)
      entriesService.getEntryById = jest.fn().mockResolvedValue('Some entry')

      expect(entriesService.getEntryById).not.toHaveBeenCalled()
      expect(entryRepository.delete).not.toHaveBeenCalled()
      await expect(entriesService.deleteEntry(dummyId, mockUser)).rejects.toThrow(NotFoundException)
      expect(entryRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
    })
  })
})
