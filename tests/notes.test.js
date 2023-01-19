const Note = require('../models/note')
const mongoose = require('mongoose')
const { initialNotes, api, server, getAllContentsAndResponsesFromNotes } = require('./helpers')

beforeEach(async () => { // hook
  await Note.deleteMany({})

  // sequential
  for (const note of initialNotes) {
    const noteObjects = new Note(note)
    await noteObjects.save()
  }
})

describe('get all notes', () => {
  test('as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/) // regex
  })

  test('there are three notes', async () => {
    const { response } = await getAllContentsAndResponsesFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('the first note is about fullstack', async () => {
    const { contents } = await getAllContentsAndResponsesFromNotes()
    expect(contents).toContain('Fullstack JS')
  })
})

describe('create a note', () => {
  test('is possible with a valid model', async () => {
    const newNote = {
      content: 'async/await',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentsAndResponsesFromNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('is not possible without content', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const { response } = await getAllContentsAndResponsesFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('delete a note', () => {
  test('is possible with a valid model', async () => {
    const { response: firstResponse } = await getAllContentsAndResponsesFromNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const { contents, response: secondResponse } = await getAllContentsAndResponsesFromNotes()
    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)

    expect(contents).not.toContain(noteToDelete.content)
  })

  test('is not possible if it does not exist', async () => {
    await api
      .delete('/api/notes/123')
      .expect(400)

    const { response } = await getAllContentsAndResponsesFromNotes()
    expect(response.body).toHaveLength(response.body.length)
  })
})

afterAll(() => { // hook
  mongoose.connection.close()
  mongoose.disconnect()
  server.close()
})
