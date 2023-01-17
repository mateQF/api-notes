// const mongoose = require('mongoose')
const Note = require('../models/note')
const { initialNotes, api, server, getAllContentsFromNotes } = require('./helpers')

beforeEach(async () => { // hook
  await Note.deleteMany({})

  const noteOne = new Note(initialNotes[0])
  await noteOne.save()

  const noteTwo = new Note(initialNotes[1])
  await noteTwo.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/) // regex
})

test('there are two notes', async () => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

test('the first note is about fullstack', async () => {
  const { contents } = await getAllContentsFromNotes()

  expect(contents).toContain('Fullstack JS')
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const { contents, response } = await getAllContentsFromNotes()

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(newNote.content)
})

test('note without content cannot be added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => { // hook
//   mongoose.connection.close()
//   mongoose.disconnect()
  server.close()
})
