"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("..");
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
describe("calculateMeanAge", () => {
    it("should return the correct mean age", () => {
        const meanAge = (0, __1.calculateMeanAge)(people);
        (0, chai_1.expect)(meanAge).to.equal(45.666666666666664);
    });
});
