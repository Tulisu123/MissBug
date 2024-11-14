
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const BASE_URL = '/api/bug/'
const STORAGE_KEY = 'bugDB'

_createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilterBy
}


async function query(filterBy = '', pageIdx = 0) {
    filterBy = { query: filterBy, page : pageIdx }
    const response = await axios.get(BASE_URL, { params: filterBy }) //get with params
    console.log('data', response.data)
    return response.data
}

async function getById(bugId) {
    const response = await axios.get(BASE_URL + bugId)
    console.log('data get by id:', response.data)
    return response.data
}

async function remove(bugId) {
    const response = await axios.delete(BASE_URL + bugId)
    console.log('data remove:', response.data)
    return response.data
}

async function save(bug) {
    console.log('bug to save', bug)
    if (bug._id) {
        console.log('editing bug ')
        const response = await axios.put(BASE_URL, bug)
        console.log('response.data', response.data)
        return response.data
    } else {
        console.log('adding bug ')
        const response = await axios.post(BASE_URL, bug)
        return response.data
    }
}

function getDefaultFilterBy() {
    return {
        title: '',
        severity: 0,
        description: ''
    }
}


function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                title: "Infinite Loop Detected",
                severity: 4,
                _id: "1NF1N1T3"
            },
            {
                title: "Keyboard Not Found",
                severity: 3,
                _id: "K3YB0RD"
            },
            {
                title: "404 Coffee Not Found",
                severity: 2,
                _id: "C0FF33"
            },
            {
                title: "Unexpected Response",
                severity: 1,
                description: 'try try try',
                _id: "G0053"
            }
        ]
        utilService.saveToStorage(STORAGE_KEY, bugs)
    }



}
