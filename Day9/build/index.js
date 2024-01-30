"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
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
        id: (0, uuid_1.v4)(),
        name: 'John',
        surname: 'Doe',
    },
    {
        id: (0, uuid_1.v4)(),
        name: 'Jane',
        surname: 'Smith',
    },
    {
        id: (0, uuid_1.v4)(),
        name: 'Michael',
        surname: 'Johnson',
    },
    {
        id: (0, uuid_1.v4)(),
        name: 'Emily',
        surname: 'Davis',
    },
    {
        id: (0, uuid_1.v4)(),
        name: 'David',
        surname: 'Brown',
    },
];
// Endpoint to get all users
app.get('/users', (req, res) => {
    res.json({ users });
});
// Endpoint to create a new user with request body validation
app.post('/users', [
    (0, express_validator_1.query)('name').notEmpty().withMessage('Name is required in the request body'),
    (0, express_validator_1.query)('surname').notEmpty().withMessage('Surname is required in the request body'),
], (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, surname } = req.body;
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
    if (user === undefined) {
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
        users.splice(index, 1);
        res.json(users);
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
