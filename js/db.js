var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "route.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE IF NOT EXISTS Users (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            pseudo      text,
            name        text, 
            firstName   text, 
            totem       text, 
            quali       text,
            staff       text,
            sex         text,
            birthday    integer,
            rond        integer,
            croix       integer,
            active      integer DEFAULT 1
            )`,
            (err) => {if (err) console.log(err)})
        db.run(
            `CREATE TABLE IF NOT EXISTS Beers (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        text,
            price       integer,
            degre       real,
            volume      real,
            image       text,
            isAvailable integer
            )`, 
            (err) => {if (err) console.log(err)})
        db.run( // TODO: Check update
            `CREATE TABLE IF NOT EXISTS Shopping (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            userId      integer,
            beerId      integer,
            date        text,
            number      integer
            )`,
            (err) => {if (err) console.log(err)});
    }
});

// Users

function getUsers(callback) {
    db.all("SELECT * FROM Users WHERE active == 1", (err, rows) => {
        if (err) console.log(err)
        if (callback) callback(err, rows)
    })
}

function getPseudos(callback) {
    db.all("SELECT pseudo FROM Users WHERE active == 1", (err, rows) => {
        if (err) console.log(err);
        if (callback) callback(
            err, 
            rows.map((row) => row.pseudo)
            );
    })
}

function getUser(pseudo, callback) {
    db.get(`SELECT * FROM Users WHERE pseudo = "${pseudo}"`, (err, row) => {
        if (err) console.log(err);
        if (callback) callback(err, row);
    })
}

function addUser(user, callback) {
    db.run(`INSERT INTO Users 
        (pseudo, name, firstName, totem, quali, staff, sex, birthday, rond, croix) 
        values 
        (?,?,?,?,?,?,?,?,0,0)`, 
        [user.pseudo, user.name,user.firstName,user.totem,user.quali,
        user.staff,user.sex,user.birthday],
        (err) => {
            if (err) console.log(err)
            if (callback) callback(err)
        })
}

function updateUser(user, callback) {
    db.run(`UPDATE Users
        SET pseudo = ?, name = ?, firstName = ?,
        totem = ?, quali = ?, staff = ?,
        sex = ?, birthday = ?
        WHERE id = ?`,
        [user.pseudo, user.name, user.firstName, user.totem, user.quali, user.staff,
        user.sex, user.birthday, user.id],
        (err) => {
            if (err) console.log(err)
            if (callback) callback(err)
        })
}

function removeUser(userId, callback) {
    db.run('UPDATE Users SET active = 0 WHERE id = ?',
        [userId],
        (err) => {
            if (err) console.log(err);
            if (callback) callback(err);
        }
    )
}



function addRond(pseudo, number, callback) {
    db.run(`UPDATE Users SET rond = rond + ? WHERE pseudo = ?`, 
        [number, pseudo],
        (err) => {
            if (err) console.log(err)
            if (callback) callback(err)
        })
}

function addCroix(pseudo, number, callback) {
    db.run(`UPDATE Users SET croix = croix + ? WHERE pseudo = ?`,
        [number, pseudo],
        (err) => {
            if (err) console.log(err)
            if (callback) callback(err)
        })
}

function resetCroix(callback) {
    db.run('UPDATE Users SET rond = rond - croix, croix = 0',
        (err) => {
            if (err) console.log(err)
            if (callback) callback(err)
        })
}

// Beers

function getBeers(callback) {
    db.all("SELECT * FROM Beers WHERE isAvailable != 2", (err, rows) => {
        if (err) console.log(err)
        if (callback) callback(err, rows)
    })
}

function getAvailableBeers(callback) {
    db.all("SELECT * FROM Beers WHERE isAvailable == 1", (err, rows) => {
        if (err) console.log(err)
        if (callback) callback(err, rows)
    })
}

function addBeer(beer, callback) {
    db.run(`INSERT INTO Beers 
        (name, price, degre, volume, image, isAvailable) 
        values (?,?,?,?,?,?)`,
        [beer.name, beer.price, beer.degre, beer.volume, beer.image, beer.isAvailable],
        (err) => {
            if (err) console.log(err)
            if (callback) callback(err)
        })
}

function updateBeer(beer, callback) {
    db.run(`UPDATE Beers 
        SET name = ?, price = ?, degre = ?, 
        volume = ?, image = ?, isAvailable = ? 
        WHERE id = ?`,
        [beer.name, beer.price, beer.degre, beer.volume, beer.image, beer.isAvailable, beer.id],
        (err) => {
            if (err) console.log(err)
            if (callback) callback(err)
        })
}

function removeBeer(beerId, callback) {
    // Set isAvailable to 2
    db.run(`UPDATE Beers SET isAvailable = 2 WHERE id = ${beerId}`,
        (err) => {
            if (err) console.log(err)
            if (callback) callback(err)
        })
}

function getPurchases(callback) {
    db.all("SELECT * FROM Shopping", (err, rows) => {
        if (err) console.log(err)
        if (callback) callback(err, rows)
    })
}

function buy(userId, beerId, number, callback) {
    db.run(
        `INSERT INTO Shopping 
        (userId, beerId, date, number) 
        values (?,?,?,?)`,
        [userId, beerId, Math.floor(Date.now()/1000), number],
        (err) => {
            if (err) {
                console.log(err);
                if (callback) callback(err)
            } else {
                db.run(
                    `UPDATE Users 
                    SET croix = croix + ?*(SELECT price FROM Beers WHERE Beers.id = ?) WHERE id = ?`,
                    [number, beerId, userId],
                    (err) => {
                        if (err) console.log(err)
                        if (callback) callback(err)
                    })
            }
    })
}

// Utils

function getUserAlcoholLevel(timestamp, tresh, callback) {
    db.all(`
        SELECT
            userId,
            case when sex = "m" 
                THEN (SUM(gAlc)*0.8)/(79.1*0.7) 
                ELSE (SUM(gAlc)*0.8)/(66.7*0.6) 
            END as alcoholLevel
        FROM Users, (
            SELECT userId, beerId, number, degre, volume, number*(degre/100)*(volume*1000) as gAlc
            FROM Shopping as s, Beers as b
            WHERE s.beerId = b.id AND date >= ?1 - ?2 and date <= ?1 + ?2
            )
        WHERE Users.id = userId
        GROUP BY userId`,
        [timestamp, tresh],
        (err, rows) => {
            if (err) console.log(err);
            if (callback) callback(err, rows);
        })
}

function getUserExpenses(timestamp, tresh, callback) {
    db.all(`
        SELECT userId, SUM(expenses)  as expenses
        FROM (
            SELECT userId, number * price as expenses
            FROM Shopping as s, Beers as b
            WHERE s.beerId = b.id AND date >= ?1 - ?2 and date <= ?1 + ?2
        )
        GROUP BY userId`,
        [timestamp, tresh],
        (err, rows) => {
            if (err) console.log(err);
            if (callback) callback(err, rows)
        })
}

module.exports.users = {
    getUsers   : getUsers,
    getPseudos : getPseudos,
    addUser    : addUser,
    getUser    : getUser,
    updateUser : updateUser,
    addRond    : addRond,
    addCroix   : addCroix,
    resetCroix : resetCroix,
    removeUser : removeUser
},

module.exports.beers = {
    getBeers: getBeers,
    getAvailableBeers : getAvailableBeers,
    addBeer: addBeer,
    updateBeer: updateBeer,
    removeBeer: removeBeer
}

module.exports.shopping = {
    buy: buy,
    getPurchases: getPurchases
}

module.exports.utils = {
    getUserAlcoholLevel: getUserAlcoholLevel,
    getUserExpenses: getUserExpenses
}