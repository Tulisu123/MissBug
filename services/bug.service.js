import { utilService } from "./util.service.js"
import fs from 'fs'

const bugs = await utilService.readJsonFile(`data/bug.json`)
const PAGE_SIZE = 5

export const bugService = {
    query,
    save,
    getById,
    remove

}

function save(bug,user) {
    console.log('user', user)
    console.log('bug in save', bug)
    try {
        if (bug._id) { 
            if(bug.creator._id !== user._id) {
                return Promise.reject('user is not authroized to preform changes on this bug')
            }
            const bugIdx = bugs.findIndex(_bug => _bug._id === bug._id)
            bugs[bugIdx] = { ...bugs[bugIdx], ...bug }
        } else {
            bug._id = utilService.makeId()
            bugs.push(bug)
        }
        _saveBugsToFile()
        return bug
    }
    catch (err) {
        Promise.reject('Unexpected Error, please contact support')
    }
}


function getById(bugId) {
    return new Promise((resolve, reject) => {
        const bug = bugs.find(_bug => _bug._id === bugId)
        if (!bug) return reject('Bug does not exists!')
        resolve(bug)
    })
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            resolve()
        }))
        console.log(bugs)
    })
}

function remove(bugId, user) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) {
        console.log('bug with this id is not found! can not be removed!')
        return Promise.reject('Bug not found');
    }
    if(bugs[bugIdx].creator._id !== user._id) {
        return Promise.reject('User is not authorized to perform changes on this bug');
    }
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function query(filterBy, pageIdx) {
    console.log('page idx in backend service: ', pageIdx)
    console.log('filterBy in backend service', filterBy)
    let bugsToReturn = bugs
    if (filterBy) {
        const regex = new RegExp(filterBy, 'i')
        bugsToReturn = bugsToReturn.filter(bug => {
            return regex.test(bug.description) ||
                regex.test(bug.title) ||
                regex.test(bug.severity)
        })
    }
    if(pageIdx !== undefined){
        pageIdx = +pageIdx
        const startIdx = pageIdx * PAGE_SIZE
        bugsToReturn = bugsToReturn.slice(startIdx,startIdx + PAGE_SIZE)
    }
    return Promise.resolve(bugsToReturn)
}