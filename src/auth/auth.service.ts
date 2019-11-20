import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { UsersService } from '../user/users.service'
import * as cryptoRandomString from 'crypto-random-string'
import { VerificationTokenEntity } from './verification.token.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import * as uuid from 'uuid'
import * as Mailgun from 'mailgun-js'
import { ConfigService } from '../config/config.service'

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService')

  constructor(
    @InjectRepository(VerificationTokenEntity)
    private readonly verificationTokenRepository: Repository<VerificationTokenEntity>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { id } = await this.usersService.signUp(authCredentialsDto)
    // what to do if an error occur when sending email ?
    if (this.configService.isEmailVerificationEnabled) {
      await this.saveTokenAndSendEmailVerification(authCredentialsDto, id)
    }
  }

  async signIn(authCrendentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.validatePassword(authCrendentialsDto)
    if (!user || !user.email) {
      throw new UnauthorizedException('Invalid credentials')
    } else if (!user.verified) {
      throw new UnauthorizedException('Email not verified')
    }
    const payload: JwtPayload = { email: user.email }
    const accessToken = await this.jwtService.sign(payload)
    this.logger.debug(`Genereated JWT token with payload ${JSON.stringify(payload)}`)
    return { accessToken }
  }

  async verifyEmail(token: string): Promise<void> {
    const verificationToken = await this.verificationTokenRepository.findOne({ token })
    if (!verificationToken || !verificationToken.user) {
      throw new NotFoundException(`Token "${token}" not found.`)
    }
    verificationToken.user.verified = true
    await verificationToken.user.save()
    await verificationToken.remove()
  }

  private async saveTokenAndSendEmailVerification(authCredentialsDto: AuthCredentialsDto, userId: uuid): Promise<void> {
    const token = cryptoRandomString({ length: 32 })
    const { email } = authCredentialsDto
    const verificationToken = Object.assign(this.verificationTokenRepository.create(), { email, token, userId })
    await verificationToken.save()

    const mailgun = new Mailgun({
      apiKey: this.configService.get('MAILGUN_API_KEY'),
      domain: this.configService.get('EMAIL_VERIFICATION_DOMAIN'),
      host: this.configService.get('EMAIL_VERIFICATION_HOST'),
    })
    const data = {
      'from': this.configService.get('EMAIL_VERIFICATION_FROM'),
      'to': email,
      'subject': 'Please verify your Shargea account',
      'template': 'email_confirm',
      'h:X-Mailgun-Variables': JSON.stringify({ hostname: this.configService.get('EMAIL_VERIFICATION_HOSTNAME'), token }),
    }

    try {
      await mailgun.messages().send(data)
      this.logger.debug(`Successfully sent verification email to ${email}`)
    } catch (err) {
      this.logger.error('Error when trying to send email: ', err)
    }
  }
}
