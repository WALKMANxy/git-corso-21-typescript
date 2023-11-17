"use strict";
console.log("Ciao");
const sum = (a, b) => a + b;
console.log(sum(2, 3));
console.log(sum(2123, 456));
const z = 2;
let y = Math.random() > 0.5 ? 2 : "Pippo";
let x = 2;
x = 3;
console.log(y, x);
console.log(typeof x);
const c = ["pippo", true, 3];
c.push(true, false, 1, "Safe");
console.log(c);
const v = ["pippo", 3].map((i) => i + "pippo");
//v.push(3)
const b = ["pippo", 3].map((i) => i + "pippo");
b.push(3);
const n = [3, 5, 6];
const m = [2];
const sum2 = (a, b) => a + (b ? b : 0);
const a = {
    name: "Test",
    surname: "Test",
    age: 99,
};
const s = [1, 2, 3];
const d = [...s];
const d1 = [3, ...s, 6];
const d2 = [3, ...s, 6, ...s];
// spalma il contenuto qui
const x1 = { name: "Test", surname: "Friend" };
const y1 = { surname: "Test", age: 99 };
const z1 = Object.assign(Object.assign(Object.assign({}, x1), y1), { name: "Adw", surname: "henlo", age: 99 });
console.log(z1);
const z2 = [Object.assign({}, x1)];
console.log(z2);
