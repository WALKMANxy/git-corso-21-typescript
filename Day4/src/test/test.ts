import { assert } from "chai";
import { addPerson, people, removePerson } from "..";


describe("test people", () => {
  const lengthOfPeople = people.length;
  const person = {
    name: "John",
    surname: "Doe",
    age: 30,
    fiscalCode: "ABC123"
  };
  beforeEach(() => {
    // Reset the people array before each test
    console.log("Reset the people array before each test");
    people.length = 0;
  });

  it("should add a person successfully", () => {
    const lengthOfPeople = people.length;

    addPerson(person);
        
    assert.equal(lengthOfPeople +1, people.length);
    assert.deepEqual(people[0], person);
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

    addPerson(person1);
    addPerson(person2);

    assert.equal(people.length, 1);
    assert.deepEqual(people[0], person1);
  });

  it("should remove a person successfully", () => {
    const person = {
      name: "John",
      surname: "Doe",
      age: 30,
      fiscalCode: "ABC123"
    };

  
    people.push(person);
    removePerson(person.fiscalCode);

    assert.equal(people.length, 0);
  });

  it("should not remove a person with a non-existing fiscal code", () => {
    removePerson("non-existing-fiscal-code");

    people.push(person)
    removePerson(person.fiscalCode);

    assert.equal(people.length, 0);
  });
  it("should not add an equal person", () => {
    const person = {
      name: "John",
      surname: "Doe",
      age: 30,
      fiscalCode: "ABC123"
    };
  
    // Add initial person
    addPerson(person);
  
    // Try adding an equal person
    addPerson(person);
  
    // Assert that the length of people remains the same
    assert.equal(people.length, 1);
  });
});

