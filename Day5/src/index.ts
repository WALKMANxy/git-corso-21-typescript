//crea una funzione che prende in ingresso un array di persone e ritorna la media dell'età delle persone che ci sono dentro, con una funzione di test 

type Person = {
    name : string
    surname : string
    age : number
}


export const calculateMeanAge = (people: Person[])=> {
    const totalAge = people
    .filter(({ age }) => age !== undefined)
    .reduce((accumulator, { age }, _ , { length }) => accumulator + (age || 0) / length, 0);
    
    return totalAge;
};

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

  const meanAge = calculateMeanAge(people);
console.log("Mean Age:", meanAge);