import { assert, expect } from "chai";
import { calculateMeanAge } from "..";

type Person = {
    name : string
    surname : string
    age : number
}

const people: Person[] = [
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
        const meanAge = calculateMeanAge(people);
        expect(meanAge).to.equal(45.666666666666664);
    });
});