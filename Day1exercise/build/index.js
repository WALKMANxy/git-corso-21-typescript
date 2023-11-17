"use strict";
function kaprekarConstantCount(number, iterations = 0) {
    const kaprekarConstant = 6174;
    if (number === kaprekarConstant || iterations >= 7) {
        return { constant: kaprekarConstant, iterations };
    }
    const digits = number.toString().padStart(4, '0').split('').map(Number);
    const ascending = [...digits].sort((a, b) => a - b);
    const descending = [...digits].sort((a, b) => b - a);
    const largest = Number(descending.join(''));
    const smallest = Number(ascending.join(''));
    return kaprekarConstantCount(largest - smallest, iterations + 1);
}
// Example usage
const result = kaprekarConstantCount(3524);
console.log(`Kaprekar's constant: ${result.constant}, Iterations: ${result.iterations}`);
