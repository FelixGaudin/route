const express = require('express')
const { exec } = require('child_process');
const app = express()
const port = 6969

const cors = require('cors');
app.use(cors({origin : "*"}));

app.use(express.json({ limit: '50mb' }));

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

let db = require('./db.js');


app.get('/users/list', (req, res) => {
    db.users.getUsers((err, users) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        } 
        else res.send(users)
    })
})

app.get('/users/pseudos', (req, res) => {
    db.users.getPseudos((err, pseudos) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else res.send(pseudos)
    })
})

app.get('/users/search', (req, res) => {
    db.users.getUsers((err, users) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        }
        else {
            let query = req.query.query;
            res.send(users.filter((user) => {
                return user.pseudo
                    .toString()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .indexOf(
                        query
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                    ) >= 0
            }))
        }
    })
})

app.post('/users/add', (req, res) => {
    db.users.addUser(req.body.data.user, (err) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        } else {
            res.send("ok")
        }
    })
})

app.put('/users/update', (req, res) => {
    db.users.updateUsers(req.body.data.toModifyUsers, (err) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        } else {
            res.send("ok")
        }
    })
})

app.delete('/users/delete/:userId', (req, res) => {
    db.users.removeUser(req.params.userId, (err) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        } else {
            res.send("ok")
        }
    })
})

app.put('/users/add-rond', (req, res) => {
    db.users.addRond(req.body.data.pseudo, req.body.data.number, (err) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        } else {
            res.send("ok")
        }
    })
})

app.put('/users/add-croix', (req, res) => {
    db.users.addRond(req.body.data.pseudo, req.body.data.number, (err) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        } else {
            res.send("ok")
        }
    })
})

app.put('/users/reset-croix', (req, res) => {
    db.users.resetCroix((err) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        } else {
            res.send("ok")
        }
    })
})

app.get('/beers/list', (req, res) => {
    db.beers.getBeers((err, beers) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        }
        else res.send(beers)
    })
})

app.get('/beers/available', (req, res) => {
    db.beers.getAvailableBeers((err, beers) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        }
        else res.send(beers)
    })
})

app.post('/beers/add', (req, res) => {
    db.beers.addBeers(req.body.data.beers, (err) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        } else {
            res.send("ok")
        }
    })
})

app.put('/beers/update', (req, res) => {
    db.beers.updateBeers(req.body.data.beers, (err) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        } else {
            res.send("ok")
        }
    })
})

app.delete('/beers/delete/:beerId', (req, res) => {
    db.beers.removeBeer(req.params.beerId, (err) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        } else {
            res.send("ok")
        }
    })
})

app.post('/shop/buy', (req, res) => {
    db.shopping.buy(req.body.data.userId, req.body.data.beerId, req.body.data.number, (err) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        } else {
            res.send("ok")
        }
    })
})

app.get('/utils/alcohol-level', (req, res) => {
    db.utils.getUserAlcoholLevel(req.query.timestamp, req.query.tresh, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        }
        else res.send(rows)
    })
})

app.get('/utils/expenses', (req, res) => {
    db.utils.getUserExpenses(req.query.timestamp, req.query.tresh, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send(err);
        }
        else res.send(rows)
    })
})

app.post("/time", (req, res) => {
    const { datetime } = req.body;
    exec(`date --set="${datetime}"`, (error, stdout, stderr) => {
        if (error) {
            console.log(error)
            return res.status(500).send(`Error executing command: ${stderr}`);
        }
        res.send(`Date and time successfully updated to: ${stdout}`);
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
