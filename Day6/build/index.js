"use strict";
const url = "https://jsonplaceholder.typicode.com/posts";
/**
 * Executes a function.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
const f = (data) => {
    console.log("Quanto ti viene restituito il dato vai in questa funzione");
    return data.json();
    console.timeEnd();
};
const f2 = () => {
    console.log("Invoca quando vai in errore");
};
const f3 = (data) => {
    console.log("data:", data);
};
const sample = () => {
    console.time();
    const r = fetch(url).then(f3).catch(f2);
    console.log("Sono qui");
};
sample();
