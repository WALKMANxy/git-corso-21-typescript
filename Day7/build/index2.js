"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const url = 'https://rickandmortyapi.com/api/character';
const handleRc = async () => {
    const response = await axios_1.default.get(url);
    const data = response.data;
    return data.results;
};
const groupByName = async () => {
    const characters = await handleRc();
    const alives = characters.filter(({ status }) => status === 'Alive');
    const deads = characters.filter(({ status }) => status === 'Dead');
    const unkowns = characters.filter(({ status }) => status === 'unknown');
    console.log(alives, unkowns, deads);
};
