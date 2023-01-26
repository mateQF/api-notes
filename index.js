require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const app = express()
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

// Routers -> notes
const {
  getAllNotesRouter,
  getNoteRouter,
  createNoteRouter,
  updateNoteRouter,
  deleteNoteRouter
} = require('./controllers/notes')

// Routers -> users
const usersRouter = require('./controllers/users')

// Routers -> login
const loginRouter = require('./controllers/login')

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

// Notes routers
app.use('/api/notes', getAllNotesRouter)
app.use(getNoteRouter)
app.use('/api/notes', createNoteRouter)
app.use(updateNoteRouter)
app.use(deleteNoteRouter)

// Users routers
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(notFound)
app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = { app, server }
