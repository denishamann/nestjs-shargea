import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './config/typeorm.config'
import { AuthModule } from './auth/auth.module'
import { EntriesModule } from './entries/entries.module'
import { CategoriesModule } from './categories/categories.module'
import { MediaModule } from './media/media.module'
import { UsersModule } from './user/users.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    EntriesModule,
    CategoriesModule,
    MediaModule,
    UsersModule,
  ],
})
export class AppModule {
}
