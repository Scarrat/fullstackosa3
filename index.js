const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

require('dotenv').config()
const Person = require('./models/person')


morgan.token('post', function getPost (req) {
    if (req.method === 'POST')
        return JSON.stringify(req.body)
  })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))





app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
      })
      .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
    .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


  
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name == undefined || !body.number == undefined) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    }
    
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(p => {
        response.json(p)
      })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(
        request.params.id, 
        person, 
        { new: true, runValidators: true }
    )
    .then(updatedPerson => {
        if (updatedPerson) {
            response.json(updatedPerson)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Person.countDocuments({})
        .then(count => {
            response.send(`Phonebook has info for ${count} people <br> ${new Date()}`)
        })
        .catch(error => next(error))
})

  


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
app.use(errorHandler)