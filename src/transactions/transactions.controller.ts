import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { GetTransactionsFilterDto } from './dto/get-transactions-filter.dto'
import { Transaction } from './transaction.entity'
import { AuthGuard } from '@nestjs/passport'
import { User } from '../user/user.entity'
import { GetUser } from '../user/get-user.decorator'
import uuid from 'uuid'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiUseTags('transactions')
@Controller('transactions')
@UseGuards(AuthGuard())
@UseInterceptors(ClassSerializerInterceptor)
export class TransactionsController {
  private logger = new Logger('TransactionsController')

  constructor(private readonly transactionsService: TransactionsService) {
  }

  @Get()
  getTransactions(
    @Query(new ValidationPipe({ whitelist: true, transform: true })) filterDto: GetTransactionsFilterDto,
    @GetUser() user: User,
  ): Promise<Transaction[]> {
    this.logger.verbose(`User "${user.email}" retrieving all transactions. Filters: ${JSON.stringify(filterDto)}`)
    return this.transactionsService.getTransactions(filterDto, user)
  }

  @Get('/:id')
  getTransactionById(
    @Param('id', new ParseUUIDPipe()) id: uuid,
    @GetUser() user: User,
  ): Promise<Transaction> {
    return this.transactionsService.getTransactionById(id, user)
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @GetUser() user: User,
  ): Promise<Transaction> {
    this.logger.verbose(`User "${user.email}" creating a new transaction. Data: ${JSON.stringify(createTransactionDto)}`)
    return this.transactionsService.createTransaction(createTransactionDto, user)
  }

  @Patch('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateTransaction(
    @Param('id', new ParseUUIDPipe()) id: uuid,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @GetUser() user: User,
  ): Promise<Transaction> {
    return this.transactionsService.updateTransaction(id, updateTransactionDto, user)
  }

  @Delete('/:id')
  deleteTransaction(
    @Param('id', new ParseUUIDPipe()) id: uuid,
    @GetUser() user: User,
  ): Promise<void> {
    return this.transactionsService.deleteTransaction(id, user)
  }
}
