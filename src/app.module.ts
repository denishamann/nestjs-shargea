import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { TransactionsModule } from './transactions/transactions.module'
import { CategoriesModule } from './categories/categories.module'
import { MediaModule } from './media/media.module'
import { UsersModule } from './user/users.module'
import { ConfigModule } from './config/config.module'
import { ConfigService } from './config/config.service'

@Module({
  imports: [
    // TypeOrmModule.forRoot(aaa),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE_NAME'),
          entities: [__dirname + '/**/*.entity.{js,ts}'],
          synchronize: configService.isDbSynchronized,
        } as TypeOrmModuleOptions
      },
      inject: [ConfigService],
    }),
    ConfigModule,
    AuthModule,
    TransactionsModule,
    CategoriesModule,
    MediaModule,
    UsersModule,
  ],
})
export class AppModule {
}
