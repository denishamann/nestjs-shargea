import { Module } from '@nestjs/common'
import { TransactionsController } from './transactions.controller'
import { TransactionsService } from './transactions.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TransactionRepository } from './transaction.repository'
import { AuthModule } from '../auth/auth.module'
import { MediaModule } from '../media/media.module'
import { CategoriesModule } from '../categories/categories.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionRepository]),
    AuthModule,
    MediaModule,
    CategoriesModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {
}
