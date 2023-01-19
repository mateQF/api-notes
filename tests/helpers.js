const { app, server } = require('../index')
const supertest = require('supertest')
const User = require('../models/user')
const api = supertest(app)

const initialNotes = [
  {
    content: 'Fullstack JS',
    important: true,
    date: new Date()
  },
  {
    content: 'React',
    important: true,
    date: new Date()
  },
  {
    content: 'Node.js',
    important: true,
    date: new Date()
  }
]

const getAllContentsAndResponsesFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  api,
  server,
  initialNotes,
  getAllContentsAndResponsesFromNotes,
  getUsers
}
