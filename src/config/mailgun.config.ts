import * as config from 'config'

const conf = config.get('email')
export const emailConfig = {
  verificationEnabled: process.env.EMAIL_VERIFICATION_ENABLED || conf.verificationEnabled,
  apiKey: process.env.EMAIL_API_KEY || conf.apiKey,
  domain: process.env.EMAIL_DOMAIN || conf.domain,
  from: process.env.EMAIL_FROM || conf.from,
  hostname: process.env.EMAIL_HOSTNAME || conf.hostname,
}
