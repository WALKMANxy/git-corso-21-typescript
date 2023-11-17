console.log("Ciao")

const sum = (a: number,b: number) => a+b 

console.log(sum(2,3))
console.log(sum(2123,456))

type StringOrNumber = string | number


const z = 2

let y = Math.random() > 0.5 ? 2 : "Pippo"
let x: number | string = 2
x = 3
console.log( y, x )

console.log(typeof x)

const c = ["pippo", true, 3]

c.push(true, false, 1, "Safe")

console.log(c)

const v = ["pippo", 3].map((i) => i + "pippo")

//v.push(3)

const b: (string|number)[] = ["pippo", 3].map((i) => i + "pippo")

b.push(3)

const n: number[] = [3,5,6]
const m: [number] = [2]

const sum2 = (a: number , b?:number) => a + (b?b:0)

type Other = {
    role : string
}

type Person =  {
    name : string
    surname : string
    age : number
}

const a: Person = {
    name: "Test",
    surname: "Test",
    age: 99,
}

const s = [1,2,3]
const d = [...s]
const d1 = [3,...s,6]
const d2 = [3,...s,6,...s]
// spalma il contenuto qui

const x1 = {name:"Test",surname:"Friend"}
const y1= {surname:"Test",age:99}
const z1= {...x1,...y1,name:"Adw",surname:"henlo",age:99}

console.log(z1)

const z2= [{...x1}]
console.log(z2)