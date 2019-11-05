import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from '../user/users.service'
import { JwtService } from '@nestjs/jwt'
import { NotFoundException, UnauthorizedException } from '@nestjs/common'
import { VerificationTokenEntity } from './verification.token.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { emailConfig } from '../config/mailgun.config'

const mockSend = jest.fn(() => Promise.resolve())
jest.mock('mailgun-js', () => {
  return jest.fn(() => ({
    messages: () => ({
      send: mockSend,
    }),
  }))
})

jest.mock('crypto-random-string', () => () => 'random token')
const dummyId = 'b3ad2d0f-89a3-43af-9a6c-891f4ca64198'

const mockUsersService = () => ({
  signUp: jest.fn(),
  validatePassword: jest.fn(),
})
const mockJwtService = () => ({
  sign: jest.fn(),
})

const mockVerificationTokenRepositoryFindOne = jest.fn()
const mockVerificationTokenRepositoryCreate = jest.fn()

const mockVerificationTokenRepository = () => ({
  create: mockVerificationTokenRepositoryCreate,
  findOne: mockVerificationTokenRepositoryFindOne,
})

describe('AuthService', () => {
  let authService
  let usersService
  let jwtService
  let repositoryMock

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        { provide: UsersService, useFactory: mockUsersService },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: getRepositoryToken(VerificationTokenEntity), useFactory: mockVerificationTokenRepository },
      ],
    }).compile()

    authService = await module.get<AuthService>(AuthService)
    usersService = await module.get<UsersService>(UsersService)
    jwtService = await module.get<JwtService>(JwtService)
    repositoryMock = await module.get(getRepositoryToken(VerificationTokenEntity))

  })
  describe('signUp', () => {
    it('should call signUp on usersService', async () => {
      usersService.signUp.mockResolvedValue({ id: dummyId })
      authService.saveTokenAndSendEmailVerification = jest.fn().mockResolvedValue('Some value')

      expect(usersService.signUp).not.toHaveBeenCalled()
      await authService.signUp('authCredentialsDto')
      expect(usersService.signUp).toHaveBeenCalledWith('authCredentialsDto')
      expect(authService.saveTokenAndSendEmailVerification).not.toHaveBeenCalled()
    })
    it('should call signUp on usersService and send email verification', async () => {
      usersService.signUp.mockResolvedValue({ id: dummyId })
      authService.saveTokenAndSendEmailVerification = jest.fn().mockResolvedValue('Some value')
      emailConfig.verificationEnabled = true

      expect(usersService.signUp).not.toHaveBeenCalled()
      await authService.signUp('authCredentialsDto')
      expect(usersService.signUp).toHaveBeenCalledWith('authCredentialsDto')
      expect(authService.saveTokenAndSendEmailVerification).toHaveBeenCalledWith('authCredentialsDto', dummyId)

    })
  })
  describe('signIn', () => {
    it('should sign in the user and return the accessToken', async () => {
      usersService.validatePassword.mockResolvedValue({ email: 'denis@shargea.com', verified: true })
      jwtService.sign.mockResolvedValue('dummyAccessToken')

      expect(usersService.validatePassword).not.toHaveBeenCalled()
      expect(jwtService.sign).not.toHaveBeenCalled()
      const result = await authService.signIn('dto')
      expect(usersService.validatePassword).toHaveBeenCalledWith('dto')
      expect(jwtService.sign).toHaveBeenCalledWith({ email: 'denis@shargea.com' })
      expect(result).toEqual({ accessToken: 'dummyAccessToken' })
    })
    it('should throw an exception because there is no matching email', async () => {
      usersService.validatePassword.mockResolvedValue({ email: null, verified: true })
      expect(usersService.validatePassword).not.toHaveBeenCalled()
      await expect(authService.signIn('dto')).rejects.toThrow(UnauthorizedException)
      expect(usersService.validatePassword).toHaveBeenCalledWith('dto')
    })
    it('should throw an exception because the user is not verified', async () => {
      usersService.validatePassword.mockResolvedValue({ email: 'denis@shargea.com', verified: false })
      expect(usersService.validatePassword).not.toHaveBeenCalled()
      await expect(authService.signIn('dto')).rejects.toThrow(UnauthorizedException)
      expect(usersService.validatePassword).toHaveBeenCalledWith('dto')
    })
  })
  describe('verifyEmail', () => {
    it('should set the user as verified', async () => {

      const verificationToken = {
        user: {
          save: jest.fn(),
        },
        remove: jest.fn(),
      }
      mockVerificationTokenRepositoryFindOne.mockResolvedValue(verificationToken)

      expect(mockVerificationTokenRepositoryFindOne).not.toHaveBeenCalled()
      expect(verificationToken.user.save).not.toHaveBeenCalled()
      expect(verificationToken.remove).not.toHaveBeenCalled()
      await authService.verifyEmail('token')
      expect(mockVerificationTokenRepositoryFindOne).toHaveBeenCalledWith({ token: 'token' })
      expect(verificationToken.user.save).toHaveBeenCalled()
      expect(verificationToken.remove).toHaveBeenCalled()
      mockVerificationTokenRepositoryFindOne.mockReset()
    })
    it('should throw an exception because token was not found', async () => {
      mockVerificationTokenRepositoryFindOne.mockResolvedValue(null)

      expect(mockVerificationTokenRepositoryFindOne).not.toHaveBeenCalled()
      await expect(authService.verifyEmail('token')).rejects.toThrow(NotFoundException)
      expect(mockVerificationTokenRepositoryFindOne).toHaveBeenCalledWith({ token: 'token' })
      mockVerificationTokenRepositoryFindOne.mockReset()
    })
    it('should throw an exception because no user linked to token was not found', async () => {
      const verificationToken = {
        user: null,
      }
      mockVerificationTokenRepositoryFindOne.mockResolvedValue(verificationToken)

      expect(mockVerificationTokenRepositoryFindOne).not.toHaveBeenCalled()
      await expect(authService.verifyEmail('token')).rejects.toThrow(NotFoundException)
      expect(mockVerificationTokenRepositoryFindOne).toHaveBeenCalledWith({ token: 'token' })
      mockVerificationTokenRepositoryFindOne.mockReset()
    })
  })
  describe('saveTokenAndSendEmailVerification', () => {
    it('should save the token and send an email verification', async () => {
      const verificationToken = {
        save: jest.fn(),
      }

      const objAssign = global.Object.assign
      global.Object.assign = jest.fn().mockReturnValue(verificationToken)
      emailConfig.apiKey = 'apikey'
      emailConfig.domain = 'domain'
      emailConfig.from = 'from'
      emailConfig.hostname = 'hostname'
      mockVerificationTokenRepositoryCreate.mockReturnValue(verificationToken)

      expect(global.Object.assign).not.toHaveBeenCalled()
      expect(verificationToken.save).not.toHaveBeenCalled()
      expect(mockVerificationTokenRepositoryCreate).not.toHaveBeenCalled()
      await authService.saveTokenAndSendEmailVerification({ email: 'denis@shargea.com' }, dummyId)
      expect(mockVerificationTokenRepositoryCreate).toHaveBeenCalled()
      expect(global.Object.assign).toHaveBeenCalledWith(verificationToken, { email: 'denis@shargea.com', token: 'random token', userId: dummyId })
      expect(verificationToken.save).toHaveBeenCalled()

      global.Object.assign = objAssign

    })
  })
})
