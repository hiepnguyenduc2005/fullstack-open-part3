import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('dist'));

morgan.token('body', (req) => {
    return JSON.stringify(req.body);
});

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons =  [
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

// 3.1
app.get('/api/persons', (request, response) => {
    response.json(persons);
});

// 3.2
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
});

// 3.3
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);
    response.json(person);
});

// 3.4
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
});


// 3.5
app.post('/api/persons', (request, response) => {
    const body = request.body;
    // 3.6
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        });
    }
    const id = Math.floor(Math.random() * 1000);
    const person = {
        id: String(id),
        name: body.name,
        number: body.number
    }
    // 3.6
    const nameExists = persons.find(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }
    persons = persons.concat(person);
    response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});