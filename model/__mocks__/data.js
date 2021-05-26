const User = {
  _id: '60acbdd44c67e5056ff6528b',
  email: 'c.gaze145@gmail.com',
  password: '$2a$08$nowHnsSbrdRj4gFmn1JAeeDM3lzTGtpISXqXp3k21asXAHyRUunYy',
  subscription: 'pro',
  avatar: 'avatars/1621933632986-me.jpg',
  createdAt: '2021-05-25T09:05:24.598+00:00',
  updatedAt: '2021-05-25T09:07:56.460+00:00',
  token: null,
}

const users = []
users[0] = User

const newUser = {
  email: 'test@test.com',
  password: 'password',
  subscription: 'starter',
}
module.exports = { User, users, newUser }
