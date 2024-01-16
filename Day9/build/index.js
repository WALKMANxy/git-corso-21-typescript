"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
(0, uuid_1.v4)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
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
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    res.json({ data });
});
const users = [
    {
        id: '1',
        name: 'John',
        surname: 'Doe',
    },
    {
        id: '2',
        name: 'Jane',
        surname: 'Smith',
    },
    {
        id: '3',
        name: 'Michael',
        surname: 'Johnson',
    },
    {
        id: '4',
        name: 'Emily',
        surname: 'Davis',
    },
    {
        id: '5',
        name: 'David',
        surname: 'Brown',
    },
];
// Endpoint to get all users
app.get('/users', (req, res) => {
    res.json({ users });
});
// Endpoint to create a new user
app.post('/users', (req, res) => {
    const { name, surname } = req.body;
    if (!name || !surname) {
        return res.status(400).json({ error: 'Name and surname are required in the request body' });
    }
    const newUser = {
        id: (0, uuid_1.v4)(),
        name,
        surname,
    };
    users.push(newUser);
    res.status(201).json({ user: newUser });
});
// Endpoint to get a single user by ID
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    const user = users.find((u) => u.id === userId);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
    }
    else {
        res.json({ user });
    }
});
// Endpoint to delete a user by ID
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
        res.status(404).json({ error: 'User not found' });
    }
    else {
        const deletedUser = users.splice(index, 1);
        res.json({ deletedUser: deletedUser[0] });
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
