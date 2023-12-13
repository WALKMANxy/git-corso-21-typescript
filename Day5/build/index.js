"use strict";
//crea una funzione che prende in ingresso un array di persone e ritorna la media dell'età delle persone che ci sono dentro, con una funzione di test 
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMeanAge = void 0;
const calculateMeanAge = (people) => {
    const totalAge = people.reduce((accumulator, { age }) => accumulator + age, 0);
    const meanAge = totalAge / people.length;
    return meanAge;
};
exports.calculateMeanAge = calculateMeanAge;
const people = [
    {
        "name": "John",
        "surname": "Doe",
        "age": 25
    },
    {
        "name": "Jane",
        "surname": "Smith",
        "age": 30
    },
    {
        "name": "Michael",
        "surname": "Johnson",
        "age": 35
    },
    {
        "name": "Mich",
        "surname": "Johnson",
        "age": 75
    },
    {
        "name": "Michael",
        "surname": "Johnson",
        "age": 25
    },
    {
        "name": "Michael",
        "surname": "Johnson",
        "age": 57
    },
    {
        "name": "Michael",
        "surname": "Johnson",
        "age": 64
    },
    {
        "name": "Michael",
        "surname": "Johnson",
        "age": 75
    },
    {
        "name": "Michael",
        "surname": "Johnson",
        "age": 25
    }
];
const meanAge = (0, exports.calculateMeanAge)(people);
console.log("Mean Age:", meanAge);
