import { Test } from '@nestjs/testing'
import { MediaService } from '../media/media.service'
import { TransactionsService } from './transactions.service'
import { TransactionRepository } from './transaction.repository'
import { GetTransactionsFilterDto } from './dto/get-transactions-filter.dto'
import { NotFoundException } from '@nestjs/common'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { CategoriesService } from '../categories/categories.service'

const mockUser = {
  id: 'b3ad2d0f-89a3-43af-9a6c-891f4ca64197',
  email: 'denis@shargea.com',
}
const dummyId = 'b3ad2d0f-89a3-43af-9a6c-891f4ca64198'
const anotherDummyId = 'b3ad2d0f-89a3-43af-9a6c-891f4ca64199'
const yetAnotherDummyId = 'b3ad2d0f-89a3-43af-9a6c-891f4ca64190'

const mockTransactionRepository = () => ({
  getTransactions: jest.fn(),
  findOne: jest.fn(),
  createTransaction: jest.fn(),
  updateTransaction: jest.fn(),
  delete: jest.fn(),
})
const mockMediaService = () => ({
  deleteMedia: jest.fn(),
  getMediaById: jest.fn(),
})
const mockCategoriesService = () => ({})

describe('TransactionsService', () => {
  let transactionsService
  let transactionRepository
  let mediaService
  let categoriesService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionsService,
        MediaService,
        CategoriesService,
        { provide: TransactionRepository, useFactory: mockTransactionRepository },
        { provide: MediaService, useFactory: mockMediaService },
        { provide: CategoriesService, useFactory: mockCategoriesService },
      ],
    }).compile()

    transactionsService = await module.get<TransactionsService>(TransactionsService)
    transactionRepository = await module.get<TransactionRepository>(TransactionRepository)
    mediaService = await module.get<MediaService>(MediaService)
    categoriesService = await module.get<CategoriesService>(CategoriesService)

  })

  describe('getTransactions', () => {
    it('should get all categories from the repository', async () => {
      const filters: GetTransactionsFilterDto = {
        search: 'Some search query',
      }
      transactionRepository.getTransactions.mockResolvedValue('Some value')

      expect(transactionRepository.getTransactions).not.toHaveBeenCalled()
      const result = await transactionsService.getTransactions(filters, mockUser)
      expect(transactionRepository.getTransactions).toHaveBeenCalledWith(filters, mockUser)
      expect(result).toEqual('Some value')
    })
  })
  describe('getTransactionById', () => {
    it('should call the repository to retrieve the transaction and return it', async () => {
      transactionRepository.findOne = jest.fn().mockResolvedValue('Some value')

      expect(transactionRepository.findOne).not.toHaveBeenCalled()
      const result = await transactionsService.getTransactionById(dummyId, mockUser)
      expect(transactionRepository.findOne).toHaveBeenCalledWith({ where: { id: dummyId, userId: mockUser.id } })
      expect(result).toEqual('Some value')
    })
    it('should throw an error because the category could not be found', async () => {
      transactionRepository.findOne = jest.fn().mockResolvedValue(null)

      expect(transactionRepository.findOne).not.toHaveBeenCalled()
      await expect(transactionsService.getTransactionById(dummyId, mockUser)).rejects.toThrow(NotFoundException)
      expect(transactionRepository.findOne).toHaveBeenCalledWith({ where: { id: dummyId, userId: mockUser.id } })
    })
  })
  describe('createTransaction', () => {
    it('should call the repository, create the transaction, and return it', async () => {
      const mockCreateTransactionDto: CreateTransactionDto = {
        title: 'Dummy title',
        amount: 13.87,
      }
      transactionRepository.createTransaction.mockResolvedValue('Some category')

      expect(transactionRepository.createTransaction).not.toHaveBeenCalled()
      const result = await transactionsService.createTransaction(mockCreateTransactionDto, mockUser)
      expect(transactionRepository.createTransaction).toHaveBeenCalledWith(mockCreateTransactionDto, mockUser)
      expect(result).toEqual('Some category')
    })
  })
  describe('updateTransaction', () => {
    it('should retrieve transaction from repository to update it and return it, image does not change', async () => {
      const mockTransaction = {
        title: 'Dummy title',
      }
      const mockUpdateTransactionDto: UpdateTransactionDto = {
        title: 'Dummy updated title',
      }

      transactionsService.getTransactionById = jest.fn().mockResolvedValue(mockTransaction)
      transactionRepository.updateTransaction.mockResolvedValue('Some transaction')

      expect(transactionsService.getTransactionById).not.toHaveBeenCalled()
      expect(transactionRepository.updateTransaction).not.toHaveBeenCalled()

      const result = await transactionsService.updateTransaction(dummyId, mockUpdateTransactionDto, mockUser)

      expect(transactionsService.getTransactionById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(transactionRepository.updateTransaction).toHaveBeenCalledWith(mockTransaction, mockUpdateTransactionDto)
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      expect(result).toEqual('Some transaction')
    })
    it('should retrieve transaction from repository to update it and return it, image changed', async () => {
      const mockTransaction = {
        imageId: anotherDummyId,
      }
      const mockUpdateTransactionDto: UpdateTransactionDto = {
        imageId: yetAnotherDummyId,
      }
      transactionsService.getTransactionById = jest.fn().mockResolvedValue(mockTransaction)
      transactionRepository.updateTransaction.mockResolvedValue('Some transaction')

      expect(transactionsService.getTransactionById).not.toHaveBeenCalled()
      expect(transactionRepository.updateTransaction).not.toHaveBeenCalled()
      expect(mediaService.getMediaById).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()

      const result = await transactionsService.updateTransaction(dummyId, mockUpdateTransactionDto, mockUser)

      expect(transactionsService.getTransactionById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(transactionRepository.updateTransaction).toHaveBeenCalledWith(mockTransaction, mockUpdateTransactionDto)
      expect(mediaService.getMediaById).toHaveBeenCalledWith(yetAnotherDummyId, mockUser)
      expect(mediaService.deleteMedia).toHaveBeenCalledWith(anotherDummyId, mockUser)
      expect(result).toEqual('Some transaction')
    })
    it('should retrieve transaction from repository to updateit and return it, image is set to null so it must be deleted', async () => {
      const mockTransaction = {
        imageId: anotherDummyId,
      }
      const mockUpdateTransactionDto: UpdateTransactionDto = {
        imageId: null,
      }
      transactionsService.getTransactionById = jest.fn().mockResolvedValue(mockTransaction)
      transactionRepository.updateTransaction.mockResolvedValue('Some transaction')

      expect(transactionsService.getTransactionById).not.toHaveBeenCalled()
      expect(transactionRepository.updateTransaction).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()

      const result = await transactionsService.updateTransaction(dummyId, mockUpdateTransactionDto, mockUser)

      expect(transactionsService.getTransactionById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(transactionRepository.updateTransaction).toHaveBeenCalledWith(mockTransaction, mockUpdateTransactionDto)
      expect(mediaService.deleteMedia).toHaveBeenCalledWith(anotherDummyId, mockUser)
      expect(result).toEqual('Some transaction')
    })
    it('should not update the transaction and act as a get because the dto is empty', async () => {
      const mockUpdateTransactionDto: UpdateTransactionDto = {}
      transactionsService.getTransactionById = jest.fn().mockResolvedValue('Some transaction')

      expect(transactionsService.getTransactionById).not.toHaveBeenCalled()

      const result = await transactionsService.updateTransaction(dummyId, mockUpdateTransactionDto, mockUser)

      expect(transactionsService.getTransactionById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(transactionRepository.updateTransaction).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      expect(result).toEqual('Some transaction')
    })
  })
  describe('delete', () => {
    it('should retrieve the transaction, call the repository to delete it, and delete the linked media', async () => {
      const mockTransaction = {
        imageId: anotherDummyId,
      }
      const mockResult = {
        affected: 1,
      }
      transactionRepository.delete.mockResolvedValue(mockResult)
      transactionsService.getTransactionById = jest.fn().mockResolvedValue(mockTransaction)

      expect(transactionsService.getTransactionById).not.toHaveBeenCalled()
      expect(transactionRepository.delete).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      await transactionsService.deleteTransaction(dummyId, mockUser)
      expect(transactionsService.getTransactionById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(transactionRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
      expect(mediaService.deleteMedia).toHaveBeenCalledWith(anotherDummyId, mockUser)
    })
    it('should retrieve the transaction that has no media, call the repository to delete it', async () => {
      const mockTransaction = {}
      const mockResult = {
        affected: 1,
      }
      transactionRepository.delete.mockResolvedValue(mockResult)
      transactionsService.getTransactionById = jest.fn().mockResolvedValue(mockTransaction)

      expect(transactionsService.getTransactionById).not.toHaveBeenCalled()
      expect(transactionRepository.delete).not.toHaveBeenCalled()
      await transactionsService.deleteTransaction(dummyId, mockUser)
      expect(transactionsService.getTransactionById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(transactionRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
    })
    it('should retrieve the transaction, call the repository to delete it, and catch the error because the image could not be deleted', async () => {
      const mockTransaction = {
        imageId: anotherDummyId,
      }
      const mockResult = {
        affected: 1,
      }
      transactionRepository.delete.mockResolvedValue(mockResult)
      transactionsService.getTransactionById = jest.fn().mockResolvedValue(mockTransaction)
      mediaService.deleteMedia.mockRejectedValue('Dummy error')

      expect(transactionsService.getTransactionById).not.toHaveBeenCalled()
      expect(transactionRepository.delete).not.toHaveBeenCalled()
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
      await transactionsService.deleteTransaction(dummyId, mockUser)
      expect(transactionsService.getTransactionById).toHaveBeenCalledWith(dummyId, mockUser)
      expect(transactionRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
      expect(mediaService.deleteMedia).toHaveBeenCalledWith(anotherDummyId, mockUser)
    })
    it('should throw an error because transaction could not be found', async () => {
      const mockResult = {
        affected: 0,
      }
      transactionRepository.delete.mockResolvedValue(mockResult)
      transactionsService.getTransactionById = jest.fn().mockResolvedValue('Some transaction')

      expect(transactionsService.getTransactionById).not.toHaveBeenCalled()
      expect(transactionRepository.delete).not.toHaveBeenCalled()
      await expect(transactionsService.deleteTransaction(dummyId, mockUser)).rejects.toThrow(NotFoundException)
      expect(transactionRepository.delete).toHaveBeenCalledWith({ id: dummyId, userId: mockUser.id })
      expect(mediaService.deleteMedia).not.toHaveBeenCalled()
    })
  })
})
