import express, {Request, Response} from 'express';
import { query, validationResult } from 'express-validator';

import {v4 as uuidv4, v4} from 'uuid';

uuidv4();
const app = express();
app.use(express.json());

// Endpoint for the list of cities
app.get('/cities', function (req, res) {
  const cities = ['City1', 'City2', 'City3']; 
  res.json({ cities });
});

// Endpoint for the list of names
app.get('/names', function (req, res) {
  const names = ['Name1', 'Name2', 'Name3']; 
  res.json({ names });
});

app.get('/posts', async (req, res) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')  
    const data = await response.json()
    res.json({ data });
});

const users = [
  {
    id: v4(),
    name: 'John',
    surname: 'Doe',
  },
  {
    id: v4(),
    name: 'Jane',
    surname: 'Smith',
  },
  {
    id: v4(),
    name: 'Michael',
    surname: 'Johnson',
  },
  {
    id: v4(),
    name: 'Emily',
    surname: 'Davis',
  },
  {
    id: v4(),
    name: 'David',
    surname: 'Brown',
  },
];

// Endpoint to get all users
app.get('/users', (req: Request, res: Response) => {
  res.json({ users });
});

// Endpoint to create a new user
app.post('/users', (req: Request, res: Response) => {
  const { name, surname } = req.body;

  if (!name || !surname) {
    return res.status(400).json({ error: 'Name and surname are required in the request body' });
  }

  const newUser = {
    id: uuidv4(),
    name,
    surname,
  };

  users.push(newUser);

  res.status(201).json({ user: newUser });
});

// Endpoint to get a single user by ID
app.get('/users/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = users.find((u) => u.id === userId);

  if (user === undefined) {
    res.status(404).json({ error: 'User not found' });
  } else {
    res.json({ user });
  }
});

// Endpoint to delete a user by ID
app.delete('/users/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    res.status(404).json({ error: 'User not found' });
  } else {
    users.splice(index, 1);
    res.json(users);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});