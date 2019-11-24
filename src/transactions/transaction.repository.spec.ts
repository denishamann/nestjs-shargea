import { Test } from '@nestjs/testing'
import { Like } from 'typeorm'
import { BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { TransactionRepository } from './transaction.repository'
import { GetTransactionsFilterDto } from './dto/get-transactions-filter.dto'
import { Transaction } from './transaction.entity'

const PG_FOREIGN_KEY_CONSTRAINT_VIOLATION = '23503'
const mockUser = {
  id: 'b3ad2d0f-89a3-43af-9a6c-891f4ca64197',
  email: 'denis@shargea.com',
}

describe('TransactionRepository', () => {
  let transactionRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionRepository,
      ],
    }).compile()

    transactionRepository = await module.get<TransactionRepository>(TransactionRepository)
  })

  describe('getTransactions', () => {
    beforeEach(() => {
      transactionRepository.find = jest.fn()
    })

    it('Should successfully find the transactions, with no filters', async () => {
      transactionRepository.find.mockReturnValue('Some transactions')
      expect(transactionRepository.find).not.toHaveBeenCalled()
      const result = await transactionRepository.getTransactions({}, mockUser)
      expect(transactionRepository.find).toHaveBeenCalledWith({ where: { userId: mockUser.id } })
      expect(result).toEqual('Some transactions')
    })
    it('Should successfully find the transactions, with filters', async () => {
      const mockFilterDto: GetTransactionsFilterDto = { search: 'some search' }
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
      transactionRepository.find.mockReturnValue('Some transactions')
      expect(transactionRepository.find).not.toHaveBeenCalled()
      const result = await transactionRepository.getTransactions(mockFilterDto, mockUser)
      expect(transactionRepository.find).toHaveBeenCalledWith({ where: mockWere })
      expect(result).toEqual('Some transactions')
    })
    it('Should throw an error because an error has occured with the find method', async () => {
      transactionRepository.find.mockRejectedValue('unknown error')
      expect(transactionRepository.find).not.toHaveBeenCalled()
      await expect(transactionRepository.getTransactions({}, mockUser)).rejects.toThrow(InternalServerErrorException)
      expect(transactionRepository.find).toHaveBeenCalledWith({ where: { userId: mockUser.id } })
    })
  })

  describe('createTransaction', () => {
    it('Should save the transaction', async () => {
      const save = jest.fn().mockResolvedValue('Some transaction')
      const mockTransactionEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockTransactionEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      const result = await transactionRepository.createTransaction('dto', mockUser)
      expect(global.Object.assign).toHaveBeenCalledWith(new Transaction(), 'dto', { user: mockUser })
      expect(save).toHaveBeenCalled()
      expect(result).toEqual('Some transaction')
      global.Object.assign = objAssign
    })
    it('Should throw an error because the mediaId and/or categoryId provided is/are invalid', async () => {
      const error = {
        code: PG_FOREIGN_KEY_CONSTRAINT_VIOLATION,
      }
      const save = jest.fn().mockRejectedValue(error)
      const mockTransactionEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockTransactionEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      await expect(transactionRepository.createTransaction('dto', mockUser)).rejects.toThrow(BadRequestException)
      expect(global.Object.assign).toHaveBeenCalledWith(new Transaction(), 'dto', { user: mockUser })
      expect(save).toHaveBeenCalled()
      global.Object.assign = objAssign
    })
    it('Should throw an error because an error has occured with the save method', async () => {
      const save = jest.fn().mockRejectedValue('unknown error')
      const mockTransactionEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockTransactionEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      await expect(transactionRepository.createTransaction('dto', mockUser)).rejects.toThrow(InternalServerErrorException)
      expect(global.Object.assign).toHaveBeenCalledWith(new Transaction(), 'dto', { user: mockUser })
      expect(save).toHaveBeenCalled()
      global.Object.assign = objAssign
    })
  })

  describe('updateTransaction', () => {
    it('Should update the transaction', async () => {
      const save = jest.fn().mockResolvedValue('Some transaction')
      const mockTransactionEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockTransactionEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      const result = await transactionRepository.updateTransaction('transaction', 'dto')
      expect(global.Object.assign).toHaveBeenCalledWith('transaction', 'dto')
      expect(save).toHaveBeenCalled()
      expect(result).toEqual('Some transaction')
      global.Object.assign = objAssign
    })
    it('Should throw an error because the mediaId and/or categoryId provided is/are invalid', async () => {
      const error = {
        code: PG_FOREIGN_KEY_CONSTRAINT_VIOLATION,
      }
      const save = jest.fn().mockRejectedValue(error)
      const mockTransactionEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockTransactionEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      await expect(transactionRepository.updateTransaction('transaction', 'dto')).rejects.toThrow(BadRequestException)
      expect(global.Object.assign).toHaveBeenCalledWith('transaction', 'dto')
      expect(save).toHaveBeenCalled()
      global.Object.assign = objAssign
    })
    it('Should throw an error because an error has occured with the save method', async () => {
      const save = jest.fn().mockRejectedValue('unknown error')
      const mockTransactionEntity = {
        save,
      }
      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(mockTransactionEntity)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(save).not.toHaveBeenCalled()
      await expect(transactionRepository.updateTransaction('transaction', 'dto')).rejects.toThrow(InternalServerErrorException)
      expect(global.Object.assign).toHaveBeenCalledWith('transaction', 'dto')
      expect(save).toHaveBeenCalled()
      global.Object.assign = objAssign
    })
  })
})
