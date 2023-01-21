const getNoteRouter = require('express').Router()
const Note = require('../models/Note')

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

module.exports = getNoteRouter
