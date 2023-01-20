const createNoteRouter = require('express').Router()
const Note = require('../models/Note')

createNoteRouter.post('/', async (req, res, next) => {
  const note = req.body

  if (!note.content) {
    return res.status(400).json({
      error: 'note.content is required'
    })
  }

  const newNote = new Note({
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date()
  })

  try {
    const savedNote = await newNote.save()
    res.status(201).json(savedNote)
  } catch (err) {
    next(err)
  }
})

module.exports = createNoteRouter
