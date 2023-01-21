const getNoteRouter = require('express').Router()
const getAllNotesRouter = require('express').Router()
const createNoteRouter = require('express').Router()
const updateNoteRouter = require('express').Router()
const deleteNoteRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

getNoteRouter.get('/api/notes/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const noteFound = await Note.findById(id)
    res.json(noteFound)
  } catch (err) {
    res.status(404).end()
    next(err)
  }
})

getAllNotesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    userName: 1,
    name: 1
  })
  res.json(notes)
})

createNoteRouter.post('/', async (req, res, next) => {
  const {
    content,
    important = false,
    userId
  } = req.body

  const user = await User.findById(userId)

  if (!content) {
    return res.status(400).json({
      error: 'content is required'
    })
  }

  const newNote = new Note({
    content,
    important,
    date: new Date(),
    user: user._id
  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    res.status(201).json(savedNote)
  } catch (err) {
    next(err)
  }
})

updateNoteRouter.put('/api/notes/:id', async (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  try {
    const noteUpdated = await Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    res.json(noteUpdated)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

deleteNoteRouter.delete('/api/notes/:id', async (req, res, next) => {
  const { id } = req.params

  await Note.findByIdAndDelete(id)
  res.status(204).end()
})

module.exports = {
  getNoteRouter,
  getAllNotesRouter,
  createNoteRouter,
  updateNoteRouter,
  deleteNoteRouter
}
