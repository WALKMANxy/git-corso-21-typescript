import axios from 'axios';

type = Status {
    'Alive' | 'Dead' | 'unknown';
}
type Character {
    id: number;
    name: string;
    status: Status
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

const url = 'https://rickandmortyapi.com/api/character';

type ResponseRickMorty = {
    info : any,
    results: Character[]
}
    

const handleRc= async () => {
    const response = await axios.get(url);
    const data = response.data as ResponseRickMorty
    return data.results
}

const groupByName = async () => {
    const characters = await handleRc()
    const alives = characters.filter(({ status}) => status === 'Alive')
    const deads = characters.filter(({ status}) => status === 'Dead')
    const unkowns = characters.filter(({ status}) => status === 'unknown')
    console.log(alives,unkowns,deads)
}