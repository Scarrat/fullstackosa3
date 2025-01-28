const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())


morgan.token('post', function getPost (req) {
    if (req.method === 'POST')
        return JSON.stringify(req.body)
  })

  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))


let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(person => person.id !== id)
    response.status(204).end()
})


  
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    }
    if (phonebook.find(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000000).toString(),
    }

    phonebook = phonebook.concat(person)
    response.json(person)
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${phonebook.length} people <br> ${new Date()}`)
})

  


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)