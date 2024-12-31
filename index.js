import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import Person from './models/person.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

const requestLogger = (request, response, next) => {
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send ({ error: error.message })
  }
  next(error)
}

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))
app.use(requestLogger)

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// let persons =  [
//     {
//       "id": "1",
//       "name": "Arto Hellas",
//       "number": "040-123456"
//     },
//     {
//       "id": "2",
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523"
//     },
//     {
//       "id": "3",
//       "name": "Dan Abramov",
//       "number": "12-43-234345"
//     },
//     {
//       "id": "4",
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122"
//     }
// ]

// 3.1
app.get('/api/persons', (request, response) => {
  // 3.13
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// 3.2
app.get('/info', (request, response) => {
  // 3.13
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
  })
})

// 3.3
app.get('/api/persons/:id', (request, response, next) => {
  // 3.18
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// 3.4
app.delete('/api/persons/:id', (request, response, next) => {
  // 3.15
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// 3.5
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  // 3.6
  // if (!body.name || !body.number) {
  //     return response.status(400).json({
  //         error: 'name or number is missing'
  //     })
  // }
  // const id = Math.floor(Math.random() * 1000)
  // 3.14
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

  // const nameExists = persons.find(person => person.name === body.name)
  // if (nameExists) {
  //     return response.status(400).json({
  //         error: 'name must be unique'
  //     })
  // }
})

// 3.17
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      console.log(updatedPerson)
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})