import * as dotenv from 'dotenv'
import * as Joi from '@hapi/joi'
import { SchemaMap } from '@hapi/joi'
import * as fs from 'fs'

export type EnvConfig = Record<string, string>

export class ConfigService {
  private readonly envConfig: EnvConfig

  constructor(filePath: string) {
    const config = ConfigService.mergeVariables(filePath)
    this.envConfig = ConfigService.validateInput(config)
  }

  private static get VALIDATION_SCHEMA(): SchemaMap {
    return {
      CORS_ENABLED: Joi.boolean().optional().default(false),
      RATE_LIMIT_ENABLED: Joi.boolean().optional().default(true),
      RATE_LIMIT_WINDOW_IN_MINUTE: Joi.number().optional().default(15),
      RATE_LIMIT_MAX: Joi.number().optional().default(10000),
      SERVER_PORT: Joi.number().optional().default(3000),
      DB_TYPE: Joi.string().optional().default('postgres'),
      DB_PORT: Joi.number().optional().default(5432),
      DB_HOST: Joi.string().required(),
      DB_USERNAME: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      DB_SYNCHRONIZE: Joi.boolean().optional().default(false),
      DB_DATABASE_NAME: Joi.string().required(),
      JWT_EXPIRES_IN: Joi.number().optional().default(3600),
      JWT_SECRET: Joi.string().required(),
      EMAIL_VERIFICATION_ENABLED: Joi.boolean().optional().default(true),
      MAILGUN_API_KEY: Joi.string().optional(),
      EMAIL_VERIFICATION_DOMAIN: Joi.string().optional(),
      EMAIL_VERIFICATION_FROM: Joi.string().optional(),
      EMAIL_VERIFICATION_HOST: Joi.string().optional(),
      EMAIL_VERIFICATION_HOSTNAME: Joi.string().optional(),

    }
  }

  get isCorsEnabled(): boolean {
    return Boolean(this.envConfig.CORS_ENABLED)
  }

  get isRateLimitEnabled(): boolean {
    return Boolean(this.envConfig.RATE_LIMIT_ENABLED)
  }

  get isEmailVerificationEnabled(): boolean {
    return Boolean(this.envConfig.EMAIL_VERIFICATION_ENABLED)
  }

  get isDbSynchronized(): boolean {
    return Boolean(this.envConfig.DB_SYNCHRONIZE)
  }

  private static mergeVariables(filePath): EnvConfig {
    let envFileVars

    try {
      envFileVars = dotenv.parse(fs.readFileSync(filePath))
    } catch (e) {
      envFileVars = []
    }
    const envVars = ConfigService.readEnvVars()
    return { ...envFileVars, ...envVars }
  }

  private static readEnvVars(): EnvConfig {
    const envVars = {}
    Object.keys(ConfigService.VALIDATION_SCHEMA).forEach((key) => {
      if (process.env[key] === undefined) {
        return
      }
      envVars[key] = process.env[key]
    })

    return envVars
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private static validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object(ConfigService.VALIDATION_SCHEMA)

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    )
    if (error) {
      throw new Error(`Config validation error: ${error.message}`)
    }
    return validatedEnvConfig
  }

  get(key: string): string {
    return this.envConfig[key]
  }
}
