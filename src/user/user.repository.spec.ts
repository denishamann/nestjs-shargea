import { Test } from '@nestjs/testing'
import { UserRepository } from './user.repository'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import { User } from './user.entity'
import * as bcrypt from 'bcryptjs'
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto'

const PG_FOREIGN_KEY_CONSTRAINT_VIOLATION = '23503'
const mockCredentialsDto: AuthCredentialsDto = { email: 'denis@shargea.com', password: 'testPassword' }

describe('UserRepository', () => {
  let userRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
      ],
    }).compile()

    userRepository = await module.get<UserRepository>(UserRepository)
  })

  describe('signUp', () => {
    let save

    beforeEach(() => {
      save = jest.fn()
      userRepository.create = jest.fn().mockReturnValue({ save })
    })

    it('Should successfully sign up the user', async () => {
      save.mockResolvedValue('Some value')
      const result = await userRepository.signUp(mockCredentialsDto)
      expect(result).toEqual('Some value')
    })

    it('Should throw a conflict exception because the email already exists', () => {
      save.mockRejectedValue({ code: PG_FOREIGN_KEY_CONSTRAINT_VIOLATION })
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException)
    })

    it('Should throw an internal server error exception', () => {
      save.mockRejectedValue({ code: 'unhandled code' })
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('validatePassword', () => {
    let user

    beforeEach(() => {
      userRepository.findOne = jest.fn()
      user = new User()
      user.email = 'denis@shargea.com'
      user.validatePassword = jest.fn()
    })

    it('Should return the email because validation is successful', async () => {
      userRepository.findOne.mockResolvedValue(user)
      user.validatePassword.mockResolvedValue(true)

      const result = await userRepository.validatePassword(mockCredentialsDto)
      expect(result).toEqual(user)
    })

    it('Should return null because the user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null)
      const result = await userRepository.validatePassword(mockCredentialsDto)
      expect(user.validatePassword).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('Should return null because the password is invalid', async () => {
      userRepository.findOne.mockResolvedValue(user)
      user.validatePassword.mockResolvedValue(false)
      const result = await userRepository.validatePassword(mockCredentialsDto)
      expect(user.validatePassword).toHaveBeenCalled()
      expect(result).toBeNull()
    })
  })

  describe('_hashPassword', () => {
    it('Sould call bcrypt.hash to generate a hash', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('hash')
      expect(bcrypt.hash).not.toHaveBeenCalled()
      // @ts-ignore
      const result = await UserRepository._hashPassword('testPassword', 'testSalt')
      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt')
      expect(result).toEqual('hash')
    })
  })
})
