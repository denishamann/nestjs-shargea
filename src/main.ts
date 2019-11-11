import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import * as config from 'config'
import * as helmet from 'helmet'
import * as rateLimit from 'express-rate-limit'
import * as compression from 'compression'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const serverConfig = config.get('server')

  const logger = new Logger('bootstrap')

  const app = await NestFactory.create(AppModule)

  if (process.env.NODE_ENV === 'development') {
    app.enableCors()
  } else {
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10000, // limit each IP to 10000 requests per windowMs
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

  const port = process.env.PORT || serverConfig.port
  await app.listen(port)
  logger.log(`Application listening on port ${port}`)
}

bootstrap()
