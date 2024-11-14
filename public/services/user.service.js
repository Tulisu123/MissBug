
import { utilService } from './util.service.js'

const SESSION_KEY_LOGGED_IN_USER = 'loggedInUser'

export const userService = {
    login,
    signup,
    logout,
    getEmptyCaredentials,
    getLoggedInUser,
    remove,
    getUsersWithoutPasswords
}

async function getUsersWithoutPasswords() {
    const response = await axios.get('api/auth/query')
    console.log(response.data)
    return response.data
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY_LOGGED_IN_USER))
}

async function login(user) {
    const response = await axios.get('api/auth/login', { params: user })
    const loggedInUser = response.data
    console.log('loggedIn user in service front', loggedInUser)
    if (loggedInUser) _setLoggedInUser(loggedInUser)
    else return 'can not sign up!'
}

async function signup({ username, password, fullname, isAdmin }) {
    const response = await axios.post('api/auth/signup', { username, password, fullname, isAdmin })
    const user = response.data
    _setLoggedInUser(user)
}

async function logout() {
    await axios.post('api/auth/logout')
    sessionStorage.removeItem(SESSION_KEY_LOGGED_IN_USER)
}

async function remove(userId) {
    const response = await axios.delete('api/auth/remove/' + userId)
    const userRemoved = response.data
    console.log('user removed in user front service:', userRemoved)
    return userRemoved
}


function getEmptyCaredentials() {
    return { username: '', password: '', fullname: '', isAdmin: false }
}

function _setLoggedInUser(user) {
    console.log('user in set', user)
    const userToSave = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(SESSION_KEY_LOGGED_IN_USER, JSON.stringify(userToSave))
    console.log(JSON.stringify(userToSave) + '   this is the saved user')
    return userToSave
}