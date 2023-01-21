const updateNoteRouter = require('express').Router()
const Note = require('../models/Note')

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

module.exports = updateNoteRouter
