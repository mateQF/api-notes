// import http from 'http' -> emascript modules
// const http = require("http"); //modulos creados por nodejs, asi se importa en node

const express = require('express')
const logger = require('./loggerMiddleware')
// cada vez q le llegue una peticion a este servidor, ejecuta esa funcion
// const app = http.createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" }); //el content type depende del tipo de archivo que vas a devolver
//   res.end("Hello World");
// });

const app = express()

app.use(express.json()) // uso el parseador json de express, es un middleware

// app.use((req, res, next) => {
//   console.log(req.method)
//   console.log(req.path)
//   console.log(req.body)
//   console.log('------')
//   next() // para que vaya a la siguiene ruta y no se quede ahi esperando
// })

app.use(logger)

// use recibe cualquier tipo de peticion, get, post, etc. Y en este caso, como no pusimos ningun path especifico, van a pasar todas

let notes = [
  {
    id: 1,
    title:
      'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
  },
  {
    id: 2,
    title: 'qui est esse',
    body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla'
  },
  {
    id: 3,
    title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
    body: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut'
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id) // pq siempre llega como string lo de la url
  const note = notes.find((note) => note.id === id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.find((note) => note.id !== id) // se guardan todas las que NO coincidan con la q quiero borrar
  res.status(204).end() // 204: no content
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'note.content is required'
    })
  }

  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  res.status(201).json(newNote)
})

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found'
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
