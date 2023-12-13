"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("..");
describe("test people", () => {
    const lengthOfPeople = __1.people.length;
    const person = {
        name: "John",
        surname: "Doe",
        age: 30,
        fiscalCode: "ABC123"
    };
    beforeEach(() => {
        // Reset the people array before each test
        console.log("Reset the people array before each test");
        __1.people.length = 0;
    });
    it("should add a person successfully", () => {
        const lengthOfPeople = __1.people.length;
        (0, __1.addPerson)(person);
        chai_1.assert.equal(lengthOfPeople + 1, __1.people.length);
        chai_1.assert.deepEqual(__1.people[0], person);
    });
    it("should not add a person with the same fiscal code", () => {
        const person1 = {
            name: "John",
            surname: "Doe",
            age: 30,
            fiscalCode: "ABC123"
        };
        const person2 = {
            name: "Jane",
            surname: "Smith",
            age: 25,
            fiscalCode: "ABC123"
        };
        (0, __1.addPerson)(person1);
        (0, __1.addPerson)(person2);
        chai_1.assert.equal(__1.people.length, 1);
        chai_1.assert.deepEqual(__1.people[0], person1);
    });
    it("should remove a person successfully", () => {
        const person = {
            name: "John",
            surname: "Doe",
            age: 30,
            fiscalCode: "ABC123"
        };
        __1.people.push(person);
        (0, __1.removePerson)(person.fiscalCode);
        chai_1.assert.equal(__1.people.length, 0);
    });
    it("should not remove a person with a non-existing fiscal code", () => {
        (0, __1.removePerson)("non-existing-fiscal-code");
        __1.people.push(person);
        (0, __1.removePerson)(person.fiscalCode);
        chai_1.assert.equal(__1.people.length, 0);
    });
    it("Equal person not added", () => {
        __1.people.push(person);
    });
});
