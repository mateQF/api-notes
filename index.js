require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const app = express()
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const usersRouter = require('./controllers/users')

app.use(cors())
app.use(express.json())

Sentry.init({
  dsn: 'https://cd6061097f4742f2b9e03caa12538182@o4504498522488832.ingest.sentry.io/4504498523799552',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app })
  ],

  tracesSampleRate: 1.0
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
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

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).then(result => {
    res.json(result)
  }).catch(err => next(err))
})

app.delete('/api/notes/:id', async (req, res, next) => {
  const { id } = req.params

  await Note.findByIdAndDelete(id)
  res.status(204).end()
})

app.post('/api/notes', async (req, res, next) => {
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
    res.json(savedNote)
  } catch (err) {
    next(err)
  }
})

app.use('/api/users', usersRouter)

app.use(notFound)
app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = { app, server }
