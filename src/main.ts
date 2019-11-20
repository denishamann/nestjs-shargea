import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import * as helmet from 'helmet'
import * as rateLimit from 'express-rate-limit'
import * as compression from 'compression'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from './config/config.service'

async function bootstrap() {

  const logger = new Logger('bootstrap')

  const app = await NestFactory.create(AppModule)
  const configService: ConfigService = app.get('ConfigService')
  if (configService.isCorsEnabled) {
    app.enableCors()
  }
  if (configService.isRateLimitEnabled) {
    app.use(
      rateLimit({
        windowMs: +configService.get('RATE_LIMIT_WINDOW_IN_MINUTE') * 60 * 1000,
        max: +configService.get('RATE_LIMIT_MAX'), // limit each IP to x requests per windowMs
      }),
    )
  }
  app.use(compression())
  app.use(helmet())

  const options = new DocumentBuilder()
    .setTitle('Shargea')
    .setDescription('The Shargea API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  await app.listen(configService.get('SERVER_PORT'))
  logger.log(`Application listening on port ${configService.get('SERVER_PORT')}`)
}

bootstrap()
