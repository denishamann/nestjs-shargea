import { Test } from '@nestjs/testing'
import { Like } from 'typeorm'
import { BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { EntryRepository } from './entry.repository'
import { GetEntriesFilterDto } from './dto/get-entries-filter.dto'
import { Entry } from './entry.entity'

const PG_FOREIGN_KEY_CONSTRAINT_VIOLATION = '23503'
const mockUser = {
  id: 'b3ad2d0f-89a3-43af-9a6c-891f4ca64197',
  email: 'denis@shargea.com',
}

describe('EntryRepository', () => {
  let entryRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntryRepository,
      ],
    }).compile()

    entryRepository = await module.get<EntryRepository>(EntryRepository)
  })

  describe('getEntries', () => {
    beforeEach(() => {
      entryRepository.find = jest.fn()
    })

    it('Should successfully find the entries, with no filters', async () => {
      entryRepository.find.mockReturnValue('Some entries')
      expect(entryRepository.find).not.toHaveBeenCalled()
      const result = await entryRepository.getEntries({}, mockUser)
      expect(entryRepository.find).toHaveBeenCalledWith({ where: { userId: mockUser.id } })
      expect(result).toEqual('Some entries')
    })
    it('Should successfully find the entries, with filters', async () => {
      const mockFilterDto: GetEntriesFilterDto = { search: 'some search' }
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
      entryRepository.find.mockReturnValue('Some entries')
      expect(entryRepository.find).not.toHaveBeenCalled()
      const result = await entryRepository.getEntries(mockFilterDto, mockUser)
      expect(entryRepository.find).toHaveBeenCalledWith({ where: mockWere })
      expect(result).toEqual('Some entries')
    })
    it('Should throw an error because an error has occured with the find method', async () => {
      entryRepository.find.mockRejectedValue('unknown error')
      expect(entryRepository.find).not.toHaveBeenCalled()
      await expect(entryRepository.getEntries({}, mockUser)).rejects.toThrow(InternalServerErrorException)
      expect(entryRepository.find).toHaveBeenCalledWith({ where: { userId: mockUser.id } })
    })
  })

  describe('createEntry', () => {
    it('Should save the entry', async () => {
      const save = jest.fn().mockResolvedValue('Some entry')
      const mockEntryEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockEntryEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      const result = await entryRepository.createEntry('dto', mockUser)
      expect(global.Object.assign).toHaveBeenCalledWith(new Entry(), 'dto', { user: mockUser })
      expect(save).toHaveBeenCalled()
      expect(result).toEqual('Some entry')
      global.Object.assign = objAssign
    })
    it('Should throw an error because the mediaId and/or categoryId provided is/are invalid', async () => {
      const error = {
        code: PG_FOREIGN_KEY_CONSTRAINT_VIOLATION,
      }
      const save = jest.fn().mockRejectedValue(error)
      const mockEntryEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockEntryEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      await expect(entryRepository.createEntry('dto', mockUser)).rejects.toThrow(BadRequestException)
      expect(global.Object.assign).toHaveBeenCalledWith(new Entry(), 'dto', { user: mockUser })
      expect(save).toHaveBeenCalled()
      global.Object.assign = objAssign
    })
    it('Should throw an error because an error has occured with the save method', async () => {
      const save = jest.fn().mockRejectedValue('unknown error')
      const mockEntryEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockEntryEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      await expect(entryRepository.createEntry('dto', mockUser)).rejects.toThrow(InternalServerErrorException)
      expect(global.Object.assign).toHaveBeenCalledWith(new Entry(), 'dto', { user: mockUser })
      expect(save).toHaveBeenCalled()
      global.Object.assign = objAssign
    })
  })

  describe('updateEntry', () => {
    it('Should update the entry', async () => {
      const save = jest.fn().mockResolvedValue('Some entry')
      const mockEntryEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockEntryEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      const result = await entryRepository.updateEntry('entry', 'dto')
      expect(global.Object.assign).toHaveBeenCalledWith('entry', 'dto')
      expect(save).toHaveBeenCalled()
      expect(result).toEqual('Some entry')
      global.Object.assign = objAssign
    })
    it('Should throw an error because the mediaId and/or categoryId provided is/are invalid', async () => {
      const error = {
        code: PG_FOREIGN_KEY_CONSTRAINT_VIOLATION,
      }
      const save = jest.fn().mockRejectedValue(error)
      const mockEntryEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockEntryEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      await expect(entryRepository.updateEntry('entry', 'dto')).rejects.toThrow(BadRequestException)
      expect(global.Object.assign).toHaveBeenCalledWith('entry', 'dto')
      expect(save).toHaveBeenCalled()
      global.Object.assign = objAssign
    })
    it('Should throw an error because an error has occured with the save method', async () => {
      const save = jest.fn().mockRejectedValue('unknown error')
      const mockEntryEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockEntryEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      await expect(entryRepository.updateEntry('entry', 'dto')).rejects.toThrow(InternalServerErrorException)
      expect(global.Object.assign).toHaveBeenCalledWith('entry', 'dto')
      expect(save).toHaveBeenCalled()
      global.Object.assign = objAssign
    })
  })
})
