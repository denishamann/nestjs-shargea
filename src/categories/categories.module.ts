import { forwardRef, Module } from '@nestjs/common'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryRepository } from './category.repository'
import { AuthModule } from '../auth/auth.module'
import { MediaModule } from '../media/media.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryRepository]),
    forwardRef(() => AuthModule),
    MediaModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {
}
