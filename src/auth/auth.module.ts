import { forwardRef, Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy'
import * as config from 'config'
import { UsersModule } from '../user/users.module'
import { VerificationTokenEntity } from './verification.token.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

const jwtConfig = config.get('jwt')

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationTokenEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expiresIn },
    }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [
    PassportModule,
  ],
})

export class AuthModule {
}
