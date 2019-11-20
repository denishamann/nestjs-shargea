import { JwtStrategy } from './jwt.strategy'
import { Test } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { User } from '../user/user.entity'
import { UsersService } from '../user/users.service'
import { ConfigService } from '../config/config.service'

const mockUsersService = () => ({
  findOne: jest.fn(),
})

const mockConfigService = () => ({
  get: jest.fn().mockReturnValue('randomEnvValue'),
})

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy
  let usersService
  let configService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        UsersService,
        ConfigService,
        { provide: UsersService, useFactory: mockUsersService },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile()

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy)
    usersService = await module.get<UsersService>(UsersService)
    configService = await module.get<ConfigService>(ConfigService)
  })

  describe('validate', () => {
    it('should validate and return the user based on JWT payload', async () => {
      const user = Object.assign(new User(), { email: 'denis@shargea.com' })

      usersService.findOne.mockResolvedValue(user)
      const result = await jwtStrategy.validate({ email: 'denis@shargea.com' })
      expect(usersService.findOne).toHaveBeenCalledWith('denis@shargea.com')
      expect(result).toEqual(user)
    })

    it('should throw an UnauthorizedException because the user could not be found', () => {
      usersService.findOne.mockResolvedValue(null)
      expect(jwtStrategy.validate({ email: 'denis@shargea.com' })).rejects.toThrow(UnauthorizedException)
    })
  })
})
