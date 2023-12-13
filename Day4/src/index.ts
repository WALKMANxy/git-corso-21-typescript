console.log("Hello, World!");


type Person = {
    name: string,
    surname: string,
    age: number
    fiscalCode: string
}

export let people: Person[] = []

export const addPerson = (person: Person) => {
    const existingPerson = people.some(
      ({fiscalCode}) => fiscalCode === person.fiscalCode
    );
    
    existingPerson
      ? console.log("Person with the same fiscal code already exists.")
      : people.push(person) && console.log("Person added successfully.");
  };
  
export const removePerson = (fiscalCode: string) => {
    const personIndex = people.findIndex(
      ({fiscalCode: f1}) => fiscalCode !== f1
      );
    
    personIndex !== -1
      ? people.splice(personIndex, 1) && console.log("Person removed successfully.")
      : console.log("Person with the specified fiscal code does not exist.");
  };