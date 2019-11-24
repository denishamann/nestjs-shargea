import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { TransactionRepository } from './transaction.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { Transaction } from './transaction.entity'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { GetTransactionsFilterDto } from './dto/get-transactions-filter.dto'
import { User } from '../user/user.entity'
import uuid from 'uuid'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { MediaService } from '../media/media.service'
import { CategoriesService } from '../categories/categories.service'

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger()

  constructor(
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
    private readonly mediaService: MediaService,
    private readonly categoriesService: CategoriesService,
  ) {
  }

  getTransactions(filterDto: GetTransactionsFilterDto, user: User): Promise<Transaction[]> {
    return this.transactionRepository.getTransactions(filterDto, user)
  }

  async getTransactionById(id: uuid, user): Promise<Transaction> {
    const result = await this.transactionRepository.findOne({ where: { id, userId: user.id } })
    if (!result) {
      throw new NotFoundException(`Transaction with ID "${id}" not found.`)
    } else {
      return result
    }
  }

  async createTransaction(createTransactionDto: CreateTransactionDto, user: User): Promise<Transaction> {
    try {
      // those calls are done to ensure that the category and/or media provided belongs to the user
      // TODO: replace this to do only one db call
      if (createTransactionDto.imageId) {
        await this.mediaService.getMediaById(createTransactionDto.imageId, user)
      }
      if (createTransactionDto.categoryId) {
        await this.categoriesService.getCategoryById(createTransactionDto.categoryId, user)
      }
    } catch (e) {
      this.logger.warn(`createTransaction: mediaId or categoryId from other user`, e)
      throw new BadRequestException('Invalid mediaId or categoryId provided.')
    }
    return this.transactionRepository.createTransaction(createTransactionDto, user)
  }

  async updateTransaction(id: uuid, updateTransactionDto: UpdateTransactionDto, user: User): Promise<Transaction> {
    const transaction = await this.getTransactionById(id, user)

    // because transactionRepository.updateTransaction modifies the object ...
    const previousImageId = transaction.imageId

    if (Object.entries(updateTransactionDto).length === 0) {
      return transaction
    }
    try {
      // those calls are done to ensure that the category and/or media provided belongs to the user
      // TODO: replace this to do only one db call
      if (updateTransactionDto.imageId) {
        await this.mediaService.getMediaById(updateTransactionDto.imageId, user)
      }
      if (updateTransactionDto.categoryId) {
        await this.categoriesService.getCategoryById(updateTransactionDto.categoryId, user)
      }
    } catch (e) {
      this.logger.warn(`updateTransaction: mediaId or categoryId from other user`, e)
      throw new BadRequestException('Invalid mediaId or categoryId provided.')
    }

    const updatedTransaction = await this.transactionRepository.updateTransaction(transaction, updateTransactionDto)

    if (
      previousImageId
      && updateTransactionDto.hasOwnProperty('imageId')
      && (updateTransactionDto.imageId === null || updateTransactionDto.imageId !== previousImageId)
    ) {
      try {
        await this.mediaService.deleteMedia(previousImageId, user)
      } catch (e) {
        this.logger.error(`Transaction successfully updated but media with id ${previousImageId} could not be deleted.`)
      }
    }
    return updatedTransaction
  }

  async deleteTransaction(id: uuid, user: User): Promise<void> {
    const { imageId } = await this.getTransactionById(id, user)
    const res = await this.transactionRepository.delete({ id, userId: user.id })

    if (res.affected === 0) {
      throw new NotFoundException(`Transaction with ID "${id}" not found.`)
    }
    if (imageId) {
      try {
        await this.mediaService.deleteMedia(imageId, user)
      } catch (e) {
        this.logger.error(`Transaction successfully deleted but media with id ${imageId} could not be deleted.`)
      }
    }
  }
}
