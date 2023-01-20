const getAllNotesRouter = require('express').Router()
const Note = require('../models/Note')

getAllNotesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})

module.exports = getAllNotesRouter
