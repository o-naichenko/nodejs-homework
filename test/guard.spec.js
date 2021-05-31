const guard = require('../helpers/guard.js')
const { HttpCode } = require('../helpers/constants')
const { User } = require('../model/__mocks__/data')
const passport = require('passport')

describe('Unit test: helpers/guard', () => {
  const req = { get: jest.fn((header) => `Bearer ${User.token}`), user: User }
  const reqWithNoAuth = {
    get: jest.fn((header) => null),
    user: User,
  }
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((response) => response),
  }
  const next = jest.fn()

  test('run function with no Authorization', () => {
    passport.authenticate = jest.fn((authType, options, callback) => () => {
      callback(null, User)
    })
    guard(reqWithNoAuth, res, next)
    expect(reqWithNoAuth.get).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
    expect(res.json).toHaveReturnedWith({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      data: 'UNAUTHORIZED',
      message: 'Unauthorized user, access denied',
    })
  })
  test('run function with unvalid token', () => {
    passport.authenticate = jest.fn((authType, options, callback) => () => {
      callback(null, { token: null })
    })
    guard(req, res, next)
    expect(req.get).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
    expect(res.json).toHaveReturnedWith({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      data: 'UNAUTHORIZED',
      message: 'Unauthorized user, access denied',
    })
  })
  test('run function with valid token', () => {
    passport.authenticate = jest.fn((authType, options, callback) => () => {
      callback(null, User)
    })
    guard(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})
