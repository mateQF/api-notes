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

// Routers
const getAllNotesRouter = require('./controllers/getAllNotes')
// const getNoteRouter = require('./controllers/getNote')
const createNoteRouter = require('./controllers/createNote')
// const updateNoteRouter = require('./controllers/updateNote')
// const deleteNoteRouter = require('./controllers/deleteNote')
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

app.get('/', (req, res) => { res.send('<h1>Hello World</h1>') })
app.use('/api/notes', getAllNotesRouter)

// app.use('/api/notes/:id', getNoteRouter)
app.get('/api/notes/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const noteFound = await Note.findById(id)
    res.json(noteFound)
  } catch (err) {
    res.status(404).end()
    next(err)
  }
})

app.use('/api/notes', createNoteRouter)

// app.use('/api/notes/:id', updateNoteRouter)
app.put('/api/notes/:id', async (req, res, next) => {
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

// app.use('/api/notes/:id', deleteNoteRouter)
app.delete('/api/notes/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    await Note.findByIdAndDelete(id)
    res.status(204).end()
  } catch (err) {
    next(err)
    res.status(404).end()
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
