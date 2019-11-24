import { EntityRepository, Like, Repository } from 'typeorm'
import { Transaction } from './transaction.entity'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { GetTransactionsFilterDto } from './dto/get-transactions-filter.dto'
import { User } from '../user/user.entity'
import { BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common'
import { UpdateTransactionDto } from './dto/update-transaction.dto'

const PG_UNIQUE_CONSTRAINT_VIOLATION = '23505'
const PG_FOREIGN_KEY_CONSTRAINT_VIOLATION = '23503'

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  private logger = new Logger('TransactionRepository')

  async getTransactions(filterDto: GetTransactionsFilterDto, user: User): Promise<Transaction[]> {
    const { search } = filterDto
    try {
      const where = search ? [
        {
          title: Like(`%${search}%`),
          userId: user.id,
        },
        {
          description: Like(`%${search}%`),
          userId: user.id,
        },
      ] : { userId: user.id }
      return await this.find({ where })
    } catch (e) {
      this.logger.error(`Failed to get transactions for User "${user.email}". Filters: ${JSON.stringify(filterDto)}`, e.stack)
      throw new InternalServerErrorException()
    }
  }

  async createTransaction(createTransactionDto: CreateTransactionDto, user: User): Promise<Transaction> {
    const transaction = Object.assign(new Transaction(), createTransactionDto, { user })
    try {
      return await transaction.save()
    } catch (e) {
      this.logger.error(`Failed to create transaction for User "${user.email}". Data: ${JSON.stringify(createTransactionDto)}`, e.stack)
      if (e.code === PG_FOREIGN_KEY_CONSTRAINT_VIOLATION) {
        throw new BadRequestException('Invalid mediaId or categoryId provided.')
      } else if (e.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new BadRequestException(`Media with ID "${transaction.id}" is already linked with another entity.`)
      }
      throw new InternalServerErrorException()
    }
  }

  async updateTransaction(transaction: Transaction, updateTransactionDto: UpdateTransactionDto) {
    const updatedTransaction = Object.assign(transaction, updateTransactionDto)
    try {
      return await updatedTransaction.save()
    } catch (e) {
      if (e.code === PG_FOREIGN_KEY_CONSTRAINT_VIOLATION) {
        throw new BadRequestException(`Invalid mediaId or categoryId provided for category with ID "${transaction.id}".`)
      } else if (e.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new BadRequestException(`Media with ID "${transaction.id}" is already linked with another entity.`)
      }
      throw new InternalServerErrorException()
    }
  }
}
