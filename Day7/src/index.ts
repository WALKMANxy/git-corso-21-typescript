import axios from 'axios';

const rickAndMortyApiUrl = 'https://rickandmortyapi.com/api/character';

interface RickAndMortyCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

async function fetchCharacters(): Promise<RickAndMortyCharacter[]> {
  try {
    const response: { data: { results: RickAndMortyCharacter[] } } = await axios.get(rickAndMortyApiUrl);
    return response.data.results;
  } catch (error: any) {
    console.error('Error fetching characters:', (error as Error).message);
    return [];
  }
}

function groupCharactersByStatus(characters: RickAndMortyCharacter[]) {
    return characters.reduce((grouped, character) => {
      const { status } = character;
      grouped[status] = grouped[status] || [];
      grouped[status].push(character);
      return grouped;
    }, {} as { [status: string]: RickAndMortyCharacter[] });
  }
function displayCharactersByStatus(groupedCharacters: { [status: string]: RickAndMortyCharacter[] }) {
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
  } else {
    console.log('No characters found.');
  }
}

main();
