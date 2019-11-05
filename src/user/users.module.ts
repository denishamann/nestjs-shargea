import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersController } from './users.controller'
import { UserRepository } from './user.repository'
import { UsersService } from './users.service'
import { AuthModule } from '../auth/auth.module'
import { MediaModule } from '../media/media.module'
import { CategoriesModule } from '../categories/categories.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    forwardRef(() => AuthModule),
    MediaModule,
    forwardRef(() => CategoriesModule),
  ],
  providers: [
    UsersService,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})

export class UsersModule {
}
