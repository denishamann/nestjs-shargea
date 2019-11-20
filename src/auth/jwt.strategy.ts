import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { User } from '../user/user.entity'
import { UsersService } from '../user/users.service'
import { ConfigService } from '../config/config.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || configService.get('JWT_SECRET'),
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload
    const user = await this.usersService.findOne(email)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
