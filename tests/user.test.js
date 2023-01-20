const bcrypt = require('bcrypt')
const User = require('../models/user')
const mongoose = require('mongoose')
const { api, server, getUsers } = require('./helpers')

describe('Creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ userName: 'mateoRoot', name: 'Mateo', passwordHash })

    await user.save()
  })

  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      userName: 'matqf',
      name: 'mate',
      passwordHash: 'r3act'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usersNames = usersAtEnd.map(user => user.userName)
    expect(usersNames).toContain(newUser.userName)
  })

  test('creating fails whit proper statuscode and message if the username is already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      userName: 'mateoRoot',
      name: 'mate',
      passwordHash: 'express'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.errors.userName.message).toContain('Error, expected `userName` to be unique. Value: `mateoRoot`')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
    mongoose.disconnect()
    server.close()
  })
})
