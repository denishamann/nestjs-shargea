import { forwardRef, Module } from '@nestjs/common'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { MediaRepository } from './media.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaRepository]),
    forwardRef(() => AuthModule),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {
}
