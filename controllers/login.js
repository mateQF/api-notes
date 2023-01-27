const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (req, res) => {
  const { body } = req
  const { userName, password } = body

  const user = await User.findOne(userName) // User.findOne({ userName })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    res.status(401).json({
      error: 'Incorrect username or password'
    })
  }

  const userForToken = {
    id: user._id,
    userName: user.userName
  }

  const token = jwt.sign(
    userForToken,
    process.env.JWT_SECRET,
    {
      expiresIn: 60 * 60 * 24 * 7
    }
  )

  res.send({
    name: user.name,
    userName: user.userName,
    token
  })
})

module.exports = loginRouter
