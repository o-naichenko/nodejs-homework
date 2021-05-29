require('dotenv').config()
const fs = require('fs/promises')
const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const { User } = require('../model/__mocks__/data')
const passport = require('passport')

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const issueToken = (payload, secret) => jwt.sign(payload, secret)
const token = issueToken({ id: User.id }, JWT_SECRET_KEY)
User.token = token

jest.mock('../model/usersApi.js')
jest.mock('cloudinary')
jest.setTimeout(10000)

describe('Testing route: api/users', () => {
  describe('Should handle PATCH request', () => {
    test('Should be success PATCH: users/avatar', async () => {
      const buffer = await fs.readFile('./test/default-user-avatar.png')
      const res = await request(app)
        .patch('/api/users/avatar')
        .set('Authorization', `Bearer ${token}`)
        .attach('avatar', buffer, 'default-user-avatar.png')

      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.data.avatarUrl).toEqual('secureAvatarUrl')
    })

    test('Should be denied PATCH: users/avatar', async () => {
      const buffer = await fs.readFile('./test/default-user-avatar.png')
      const res = await request(app)
        .patch('/api/users/avatar')
        .set('Authorization', `Bearer token`)
        .attach('avatar', buffer, 'default-user-avatar.png')

      expect(res.status).toEqual(401)
    })
  })
})
