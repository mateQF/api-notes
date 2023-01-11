require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')
const logger = require('./loggerMiddleware')
const app = express()
const Note = require('./models/Note')

app.use(cors())
app.use(express.json())
app.use(logger)

// let notes = []

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id).then(note => {
    if (note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  }).catch(err => {
    next(err)
  })
})

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findByIdAndRemove(id).then(result => {
    res.status(204).end()
  }).catch(err => next(err))
})

app.post('/api/notes', (req, res) => {
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

  newNote.save().then(savedNote => {
    res.json(savedNote)
  }).catch(err => {
    console.error(err)
  })
})

app.use((error, req, res, next) => {
  console.error(error)
  if (error.name === 'CastError') {
    res.status(400).send({
      error: 'The id used is incorrect'
    })
  } else {
    res.status(500).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
