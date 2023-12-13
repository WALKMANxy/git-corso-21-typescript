"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePerson = exports.addPerson = exports.people = void 0;
console.log("Hello, World!");
exports.people = [];
const addPerson = (person) => {
    const existingPerson = exports.people.some(p => p.fiscalCode === person.fiscalCode);
    existingPerson
        ? console.log("Person with the same fiscal code already exists.")
        : exports.people.push(person) && console.log("Person added successfully.");
};
exports.addPerson = addPerson;
const removePerson = (fiscalCode) => {
    const personIndex = exports.people.findIndex(p => p.fiscalCode === fiscalCode);
    personIndex !== -1
        ? exports.people.splice(personIndex, 1) && console.log("Person removed successfully.")
        : console.log("Person with the specified fiscal code does not exist.");
};
exports.removePerson = removePerson;
