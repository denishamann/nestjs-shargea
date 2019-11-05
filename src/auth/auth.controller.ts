import { Body, Controller, Get, Logger, Param, Post, UnauthorizedException, ValidationPipe } from '@nestjs/common'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { AuthService } from './auth.service'
import { ApiUseTags } from '@nestjs/swagger'

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {

  private readonly logger = new Logger()

  constructor(private readonly authService: AuthService) {
  }

  @Post('/signup')
  signUp(@Body(new ValidationPipe({ whitelist: true, transform: true })) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto)
  }

  @Post('/signin')
  signIn(
    @Body(new ValidationPipe(
      {
        whitelist: true,
        transform: true,
        exceptionFactory: () => new UnauthorizedException('Invalid credentials'),
      }),
    ) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto)
  }

  @Get('/email/verify/:token')
  // not idempotent
  async verifyEmail(
    @Param('token', new ValidationPipe({ transform: true })) token: string,
  ): Promise<string> {
    try {
      await this.authService.verifyEmail(token)
      return 'Your email has been successfully verified.'
    } catch (e) {
      this.logger.error(`Fail to validate token: "${token}"`, e.stack)
      return 'An error occured while verifying your email.'
    }
  }
}
