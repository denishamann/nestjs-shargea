import { Module } from '@nestjs/common'
import { EntriesController } from './entries.controller'
import { EntriesService } from './entries.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EntryRepository } from './entry.repository'
import { AuthModule } from '../auth/auth.module'
import { MediaModule } from '../media/media.module'
import { CategoriesModule } from '../categories/categories.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([EntryRepository]),
    AuthModule,
    MediaModule,
    CategoriesModule,
  ],
  controllers: [EntriesController],
  providers: [EntriesService],
})
export class EntriesModule {
}
