const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.post('/', async (req, res) => {
  try {
    const { body } = req
    const { userName, name } = body
    let { passwordHash } = body

    const saltRounds = 10
    passwordHash = await bcrypt.hash(passwordHash, saltRounds)
    const user = new User({
      userName,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(400).json(error)
  }
})

module.exports = usersRouter
