 
import {LoadCommunitiesForMCPParams} from "../types/regionMapData.types";
import * as path from 'path';
import * as fs from 'fs';

export const baseURL = "https://www.kbhome.com"

interface IFDivision {
    id: string;
    name: string;
    path: string;
    displayName: string;
}

export const divisions = {
    B44oFSTVAVEJm7yDZ4GU: 'austin',
    '8ygwJZjSu5kksDhq0i1S': 'coastal_orange_county',
    jzI3eR54ND7bsXoapqGJ: 'coastal_san_diego',
    NovejBL6hK4cE4PT0HMs: 'dallas',
    vsdYaz40yUs2lZGwQ3Q4: 'denver',
    '1YiFt57ojVGnE6LXOSrd': 'houston',
    RM3nuN3ePCQrN8Bjvw1K: 'jacksonville_area',
    uXiVVav1F33iIwUFmzpb: 'las_vegas',
    '0GUGWsHFz6YEExPgL15k': 'los_angeles_ventura',
    rLqeNr2EAeuKCUpjE53e: 'north_bay_central_valley',
    hSTP3ytwZDzG8ZIzCJ9q: 'orlando',
    RXxIILP1RMjeiHKoH547: 'phoenix',
    '1CLG6GabeCfYdsZQAxt5': 'raleigh_durham',
    '2ETyE5Dwv6SXvyWKjzjS': 'riverside_san_bernardino',
    llWnHDDAhL0NkjTPG3ud: 'sacramento_central_valley',
    OjE6LNnOST7tONr2G2Si: 'san_antonio',
    fk8bu3pWhWxGCQhYzKpa: 'seattle',
    vc15vJwOLlx395jHI686: 'south_bay',
    Q2gKyUi9jUipfzmxOVB8: 'tampa',
    sKqDlMplvWLTyIBISY7f: 'tucson'
};

const divisionPaths = [
    'new-homes-tucson.json',
    'new-homes-austin.json',
    'new-homes-bay-area-north.json',
    'new-homes-bay-area-south.json',
    'new-homes-boise-area.json',
    'new-homes-central-valley.json',
    'new-homes-charlotte-area.json',
    'new-homes-dallas-fort-worth.json',
    'new-homes-denver-and-northern-colorado.json',
    'new-homes-fresno-area.json',
    'new-homes-houston.json',
    'new-homes-jacksonville-st-augustine-area.json',
    'new-homes-lakeland-area.json',
    'new-homes-las-vegas.json',
    'new-homes-los-angeles-and-ventura-county.json',
    'new-homes-orange-county.json',
    'new-homes-orlando-area.json',
    'new-homes-palm-coast-area.json',
    'new-homes-phoenix.json',
    'new-homes-raleigh-durham-chapel-hill.json',
    'new-homes-riverside-county.json',
    'new-homes-sacramento.json',
    'new-homes-san-antonio.json',
    'new-homes-san-bernardino-county.json',
    'new-homes-san-diego-county.json',
    'new-homes-sarasota-bradenton.json',
    'new-homes-seattle-tacoma-area.json',
    'new-homes-southwest-florida.json',
    'new-homes-tampa-area.json',
    'new-homes-temple-belton.json'
];

export const divisionsWithPaths = {
    B44oFSTVAVEJm7yDZ4GU: {
        id: 'B44oFSTVAVEJm7yDZ4GU',
        name: 'austin',
        path: 'new-homes-austin.json',
        displayName: 'Austin'
    },
    '8ygwJZjSu5kksDhq0i1S': {
        id: '8ygwJZjSu5kksDhq0i1S',
        name: 'coastal_orange_county',
        path: 'new-homes-orange-county.json',
        displayName: 'Coastal Orange County'
    },
    jzI3eR54ND7bsXoapqGJ: {
        id: 'jzI3eR54ND7bsXoapqGJ',
        name: 'coastal_san_diego',
        path: 'new-homes-san-diego-county.json',
        displayName: 'Coastal San Diego'
    },
    NovejBL6hK4cE4PT0HMs: {
        id: 'NovejBL6hK4cE4PT0HMs',
        name: 'dallas',
        path: 'new-homes-dallas-fort-worth.json',
        displayName: 'Dallas'
    },
    vsdYaz40yUs2lZGwQ3Q4: {
        id: 'vsdYaz40yUs2lZGwQ3Q4',
        name: 'denver',
        path: 'new-homes-denver-and-northern-colorado.json',
        displayName: 'Denver'
    },
    '1YiFt57ojVGnE6LXOSrd': {
        id: '1YiFt57ojVGnE6LXOSrd',
        name: 'houston',
        path: 'new-homes-houston.json',
        displayName: 'Houston'
    },
    RM3nuN3ePCQrN8Bjvw1K: {
        id: 'RM3nuN3ePCQrN8Bjvw1K',
        name: 'jacksonville_area',
        path: 'new-homes-jacksonville-st-augustine-area.json',
        displayName: 'Jacksonville Area'
    },
    uXiVVav1F33iIwUFmzpb: {
        id: 'uXiVVav1F33iIwUFmzpb',
        name: 'las_vegas',
        path: 'new-homes-las-vegas.json',
        displayName: 'Las Vegas'
    },
    '0GUGWsHFz6YEExPgL15k': {
        id: '0GUGWsHFz6YEExPgL15k',
        name: 'los_angeles_ventura',
        path: 'new-homes-los-angeles-and-ventura-county.json',
        displayName: 'Los Angeles Ventura'
    },
    rLqeNr2EAeuKCUpjE53e: {
        id: 'rLqeNr2EAeuKCUpjE53e',
        name: 'north_bay_central_valley',
        path: 'new-homes-bay-area-north.json',
        displayName: 'North Bay Central Valley'
    },
    hSTP3ytwZDzG8ZIzCJ9q: {
        id: 'hSTP3ytwZDzG8ZIzCJ9q',
        name: 'orlando',
        path: 'new-homes-orlando-area.json',
        displayName: 'Orlando'
    },
    RXxIILP1RMjeiHKoH547: {
        id: 'RXxIILP1RMjeiHKoH547',
        name: 'phoenix',
        path: 'new-homes-phoenix.json',
        displayName: 'Phoenix'
    },
    '1CLG6GabeCfYdsZQAxt5': {
        id: '1CLG6GabeCfYdsZQAxt5',
        name: 'raleigh_durham',
        path: 'new-homes-raleigh-durham-chapel-hill.json',
        displayName: 'Raleigh Durham'
    },
    '2ETyE5Dwv6SXvyWKjzjS': {
        id: '2ETyE5Dwv6SXvyWKjzjS',
        name: 'riverside_san_bernardino',
        path: 'new-homes-riverside-county.json',
        displayName: 'Riverside San Bernardino'
    },
    llWnHDDAhL0NkjTPG3ud: {
        id: 'llWnHDDAhL0NkjTPG3ud',
        name: 'sacramento_central_valley',
        path: 'new-homes-sacramento.json',
        displayName: 'Sacramento Central Valley'
    },
    OjE6LNnOST7tONr2G2Si: {
        id: 'OjE6LNnOST7tONr2G2Si',
        name: 'san_antonio',
        path: 'new-homes-san-antonio.json',
        displayName: 'San Antonio'
    },
    fk8bu3pWhWxGCQhYzKpa: {
        id: 'fk8bu3pWhWxGCQhYzKpa',
        name: 'seattle',
        path: 'new-homes-seattle-tacoma-area.json',
        displayName: 'Seattle'
    },
    vc15vJwOLlx395jHI686: {
        id: 'vc15vJwOLlx395jHI686',
        name: 'south_bay',
        path: 'new-homes-bay-area-south.json',
        displayName: 'South Bay'
    },
    Q2gKyUi9jUipfzmxOVB8: {
        id: 'Q2gKyUi9jUipfzmxOVB8',
        name: 'tampa',
        path: 'new-homes-tampa-area.json',
        displayName: 'Tampa'
    },
    sKqDlMplvWLTyIBISY7f: {
        id: 'sKqDlMplvWLTyIBISY7f',
        name: 'tucson',
        path: 'new-homes-tucson.json',
        displayName: 'Tucson'
    }
};

/**
 * Busca una división por su nombre en divisionsWithPaths
 * @param divisionName - El nombre de la división (ej: 'phoenix', 'austin', 'dallas')
 * @returns El objeto de la división encontrada o null si no existe
 */
export function getDivisionByName(divisionName : string): IFDivision {
    const normalizedName = divisionName.toLowerCase().trim();

    // Buscar por nombre exacto
    const divisionEntry = Object.values(divisionsWithPaths).find(division => division.name === normalizedName);

    if (divisionEntry) {
        return divisionEntry;
    }

    // Buscar por displayName (más flexible)
    const displayNameMatch = Object.values(divisionsWithPaths).find(division => division.displayName.toLowerCase() === normalizedName);

    if (displayNameMatch) {
        return displayNameMatch;
    }

    // Buscar por displayName parcial (contiene el texto)
    const partialMatch = Object.values(divisionsWithPaths).find(division => division.displayName.toLowerCase().includes(normalizedName));

    return partialMatch as IFDivision;
}
  

export const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
}

export const getPathCommunities = (community : string) => { 
    const communityAlias = community.split('/')[2]; 
    const outputFileName = `${communityAlias}.json`;
 
    if (!fs.existsSync(path.join(__dirname, `../../data/communities/${getTodayDate()}`))){
        fs.mkdirSync(path.join(__dirname, `../../data/communities/${getTodayDate()}`), { recursive: true });
    }
    return path.join(__dirname, `../../data/communities/${getTodayDate()}/${outputFileName}`); 
}

export const getPathDivision = (division: string) => {
    const outputFileName = `${division}.json`;
    if (!fs.existsSync(path.join(__dirname, `../../data/divisions/${getTodayDate()}`))){
        fs.mkdirSync(path.join(__dirname, `../../data/divisions/${getTodayDate()}`), { recursive: true });
    }
    return path.join(__dirname, `../../data/divisions/${getTodayDate()}/${outputFileName}`);
}