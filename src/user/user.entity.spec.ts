import { User } from './user.entity'
import * as bcrypt from 'bcryptjs'

describe('User entity', () => {
  let user: User

  beforeEach(() => {
    user = new User()
    user.password = 'hashedPassword'
    bcrypt.compare = jest.fn()
  })

  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      bcrypt.compare.mockReturnValue(true)
      expect(bcrypt.compare).not.toHaveBeenCalled()
      const result = await user.validatePassword('testPassword')
      expect(bcrypt.compare).toHaveBeenCalledWith('testPassword', 'hashedPassword')
      expect(result).toEqual(true)
    })

    it('returns false as password is invalid', async () => {
      bcrypt.compare.mockReturnValue(false)
      expect(bcrypt.compare).not.toHaveBeenCalled()
      const result = await user.validatePassword('testPassword')
      expect(bcrypt.compare).toHaveBeenCalledWith('testPassword', 'hashedPassword')
      expect(result).toEqual(false)
    })
  })
})
