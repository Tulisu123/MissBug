import fs from 'fs'
import fr from 'follow-redirects'

const { http, https } = fr

export const utilService = {
    readFile,
    writeFile,
    download,
    readJsonFile,
    makeId
}

function readFile(path) {
    return new Promise((resolve) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) return err
            resolve(data)
        })
    })
}


function makeId(length = 6) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


async function readJsonFile(path) {
    try {
        return await new Promise((resolve) => {
            fs.readFile(path, 'utf-8', (err, data) => {
                if (err) return Promise.reject(err)
                const jsonData = JSON.parse(data)
                resolve(jsonData)
            })
        })
    } catch(err) {
        return Promise.reject(err)
    }
}


function writeFile(path, data) {
    console.log('path', path)
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (error) => {
            if (error) reject(error)
            else {
                resolve(data)
            }
        })
    })
}

function download(url, fileName) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(fileName)
        https.get(url, content => {
            content.pipe(file)
            file.on('error', reject)
            file.on('finish', () => {
                file.close()
                resolve()
            })
        })
    })
}