function kaprekarConstantCount(number: number): { constant: number; iterations: number } {
    const kaprekarConstant = 6174;
    let iterations = 0;

    while (number !== kaprekarConstant && iterations < 7) {
        const digits = number.toString().split('').map(Number);

        // Ensure the number has four digits
        while (digits.length < 4) {
            digits.unshift(0);
        }

        // Sort the digits to get the largest and smallest numbers
        const ascending = digits.slice().sort((a, b) => a - b);
        const descending = digits.slice().sort((a, b) => b - a);

        const largest = Number(descending.join(''));
        const smallest = Number(ascending.join(''));

        // Calculate the next number
        number = largest - smallest;
        iterations++;è
    }

    return { constant: kaprekarConstant, iterations };
}

// Example usage
const result = kaprekarConstantCount(3524);
console.log(`Kaprekar's constant: ${result.constant}, Iterations: ${result.iterations}`);
