const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const PORT = 8888

var db = require('./js/db.js')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.get('/users', (req, res) => {
    db.users.getUsers((err, users) => {
        if (!err) {
            res.status(200).send(users)
        } else {
            res.status(500).send('')
        }
    })
})

app.get('/user', (req, res) => {
    db.users.getUser(req.query.pseudo, (err, user) => {
        if (!err) {
            res.status(200).send(user)
        } else {
            res.status(500).send('')
        }
    })
})