"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const rickAndMortyApiUrl = 'https://rickandmortyapi.com/api/character';
async function fetchCharacters() {
    try {
        const response = await axios_1.default.get(rickAndMortyApiUrl);
        return response.data.results;
    }
    catch (error) {
        console.error('Error fetching characters:', error.message);
        return [];
    }
}
function groupCharactersByStatus(characters) {
    return characters.reduce((grouped, character) => {
        const { status } = character;
        grouped[status] = grouped[status] || [];
        grouped[status].push(character);
        return grouped;
    }, {});
}
function displayCharactersByStatus(groupedCharacters) {
    Object.entries(groupedCharacters).forEach(([status, characters]) => {
        console.log(`${status} Characters:`);
        characters.forEach(({ name }) => console.log(`  - ${name}`));
    });
}
async function main() {
    const characters = await fetchCharacters();
    if (characters.length > 0) {
        const groupedCharacters = groupCharactersByStatus(characters);
        displayCharactersByStatus(groupedCharacters);
    }
    else {
        console.log('No characters found.');
    }
}
main();
