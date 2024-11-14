import express from 'express'
import { bugService } from './services/bug.service.js'
import cookieParser from 'cookie-parser'

import { userService } from './services/user.service.js'
const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

let visitedBugs = []

//fallback
app.get('/api/')

app.get('/api/bug', async (req, res) => {
    const { query: filterBy, page: pageIdx } = req.query
    try {
        const bugs = await bugService.query(filterBy, +pageIdx)
        res.send(bugs)
    }
    catch (err) {
        console.log('err in server: ----> ', err)
    }
})


app.get('/api/bug/save', async (req, res) => {
    const dcrypredUser = userService.validateToken(req.cookies.loginToken)
    console.log(dcrypredUser + 'this is the user')
    if (!dcrypredUser) return res.status(401).send('Unauthenticated')

    try {
        const bugToSave = {
            _id: req.query.id,
            title: req.query.title,
            description: req.query.description,
            severity: req.query.severity,
            createdAt: Date.now()
        }
        const addedBug = await bugService.save(bugToSave)
        res.send(addedBug)
    }
    catch (err) {
        console.log(err)
    }
})

app.put('/api/bug', async (req, res) => {
    const dcrypredUser = userService.validateToken(req.cookies.loginToken)
    if (!dcrypredUser) res.status(401).send('Unauthenticated')
    try {
        const bugToEdit = {
            _id: req.body._id,
            title: req.body.title,
            description: req.body.description,
            severity: req.body.severity,
            creator: {
                _id: req.body.creator._id,
                fullname: req.body.creator.fullname,
            }
        }
        const editedBug = await bugService.save(bugToEdit, dcrypredUser)
        res.send(editedBug)
    }
    catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
})

app.post('/api/bug', async (req, res) => {
    const dcrypredUser = userService.validateToken(req.cookies.loginToken)
    if (!dcrypredUser) res.status(401).send('Unauthenticated')
    try {
        const bugToSave = {
            title: req.body.title,
            description: req.body.description,
            severity: req.body.severity,
            createdAt: Date.now(),
            creator: {
                _id: req.body.creator._id,
                fullname: req.body.creator.fullname,
            }
        }
        const addedBug = await bugService.save(bugToSave)
        res.send(addedBug)
    }
    catch (err) {
        console.log(err)
        res.send(err)
    }
})

app.get('/api/bug/:id', async (req, res) => {
    try {
        const bugId = req.params.id
        const bug = await bugService.getById(bugId)
        res.send(bug)
    }
    catch (err) {
        console.log('Can not find id', err)
        res.end()
    }
})

app.delete('/api/bug/:id', async (req, res) => {
    const dcrypredUser = userService.validateToken(req.cookies.loginToken)
    if (!dcrypredUser) res.status(401).send('Unauthenticated')
    try {
        const bugId = req.params.id
        const removedBug = await bugService.remove(bugId, dcrypredUser)
        res.send(removedBug)
    } catch (err) {
        console.log('Error:', err);
        res.status(400).send(err);
    }
})

app.delete('/api/auth/remove/:id', async (req, res) => {
    const userIdToRemove = req.params.id
    const userToRemove = await userService.remove(userIdToRemove)
    res.send(userToRemove)
})

app.get('/api/auth/login', async (req, res) => {
    const user = {
        username: req.query.username,
        password: req.query.password,
        fullname: req.query.fullname,
        isAdmin: req.query.isAdmin
    }
    const loggedInUser = await userService.validateLogin(user)
    console.log(loggedInUser, 'user in server')
    if (loggedInUser) {
        const loginToken = userService.getLoginToken(loggedInUser)
        res.cookie('loginToken', loginToken)
        res.send(loggedInUser)
    } else {
        res.status(404).send('Invalid Username or password')
    }
})

app.get('/api/auth/query', async (req, res) => {
    const users = await userService.query()
    res.send(users)
})

app.post('/api/auth/signup', async (req, res) => {
    const userToSave = {
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname,
        isAdmin: req.body.isAdmin
    }
    const user = await userService.save(userToSave)
    if (user) {
        const loginToken = userService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.send(user)
    } else {
        res.status(404).send('Can not signup, please contact support')
    }
})

app.post('/api/auth/logout', async (req, res) => {
    res.clearCookie('loginToken')
    res.send('Cookie cleared')
})


//cookies

app.listen(3030, '127.0.0.1', () => console.log('Server ready at http://127.0.0.1:3030'));
