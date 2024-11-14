
import { utilService } from "./util.service.js"
import fs from 'fs'
import Cryptr from "cryptr"

const cryptr = new Cryptr(process.env.SECRET1 || 'secret-puk-1234')

export const userService = {
    save,
    validateLogin,
    getLoginToken,
    validateToken,
    query,
    remove
}

const users = await utilService.readJsonFile(`data/user.json`)

function save(user) {
    try {
        user._id = utilService.makeId()
        users.push(user)
        _saveUsersToFile()
        return user
    } catch (err) {
        console.log(err)
    }
}

function query() {
    const filteredUsers = users.filter(user => user.isAdmin !== true)
    return filteredUsers
}

function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateLogin(userToValidate) {
    const { username, password } = userToValidate
    const userToLogIn = users.find(user => user.username === username && user.password === password)
    if (userToLogIn) return userToLogIn
    else return null
}

function validateToken(token) {
    if (!token) return null
    const str = cryptr.decrypt(token)
    const user = JSON.parse(str)
    return user
}

function remove(userId) {
    const userToRmove = JSON.stringify(users.find(user => user._id === userId))
    const userToRemoveIdx = JSON.stringify(users.findIndex(user => user._id === userId))
    if (!userToRemoveIdx) return Promise.resolve('Error, can not remove user!')
    users.splice(userToRemoveIdx, 1)
    _saveUsersToFile()
    return userToRmove
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', data, (err => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            resolve()
        }))
        console.log(users)
    })
}
