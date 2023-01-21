const deleteNoteRouter = require('express').Router()
const Note = require('../models/Note')

deleteNoteRouter.delete('/api/notes/:id', async (req, res, next) => {
  const { id } = req.params

  await Note.findByIdAndDelete(id)
  res.status(204).end()
})

module.exports = deleteNoteRouter
