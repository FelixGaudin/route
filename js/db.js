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
            pseudo      text PRIMARY KEY,
            name        text, 
            firstName   text, 
            totem       text, 
            quali       text,
            staff       text,
            sex         text,
            birthday    integer,
            rond        integer,
            croix       integer
            )`,
            (err) => {if (err) console.log(err)})
        db.run(
            `CREATE TABLE IF NOT EXISTS Beers (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        text,
            price       integer,
            degre       real,
            volume      real,
            isAvaible   integer
            )`, 
            (err) => {if (err) console.log(err)})
        db.run( // TODO: Check update
            `CREATE TABLE IF NOT EXISTS Shopping (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            pseudo      text,
            beerId      integer,
            date        text,
            number      integer
            )`,
            (err) => {if (err) console.log(err)});
    }
});

// Users

function getUsers(callback) {
    db.all("SELECT * FROM Users", (err, rows) => {
        if (err) console.log(err)
        if (callback != undefined) callback(err, rows)
    })
}

function getPseudos(callback) {
    db.all("SELECT pseudo FROM Users", (err, rows) => {
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
        callback(err, row);
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
        WHERE pseudo = ?`,
        [user.pseudo, user.name, user.firstName, user.totem, user.quali, user.staff,
        user.sex, user.birthday, user.oldPseudo],
        (err) => {
            if (err) console.log(err)
            if (callback != undefined) callback(err)
        })
}

function removeUser(pseudo, callback) {
    db.run(`DELETE FROM Users WHERE pseudo = ?`,
        [pseudo],
        (err) => {
            if (err) console.log(err)
            if (callback != undefined) callback(err)
        })
}

function addRond(pseudo, number, callback) {
    db.run(`UPDATE Users SET rond = rond + ${number} WHERE pseudo = ${pseudo}`, 
        (err) => {
            if (err) console.log(err)
            if (callback != undefined) callback(err)
        })
}

function addCroix(pseudo, number, callback) {
    db.run(`UPDATE Users SET croix = croix + ${number} WHERE pseudo = ${pseudo}`,
        (err) => {
            if (err) console.log(err)
            if (callback != undefined) callback(err)
        })
}

function resetCroix(callback) {
    db.run('UPDATE Users SET rond = rond - croix, croix = 0',
        (err) => {
            if (err) console.log(err)
            if (callback != undefined) callback(err)
        })
}

// Beers

function getBeers(callback) {
    db.all("SELECT * FROM Beers", (err, rows) => {
        if (err) console.log(err)
        if (callback != undefined) callback(err, rows)
    })
}

function addBeer(beer, callback) {
    db.run(`INSERT INTO Beers 
        (name, price, degre, volume, isAvaible) 
        values (${beer.name},${beer.price},${beer.degre},${beer.volume},1)`,
        (err) => {
            if (err) console.log(err)
            if (callback != undefined) callback(err)
        })
}

function updateBeer(beer, callback) {
    db.run(`UPDATE Beers 
        SET name = ${beer.name}, price = ${beer.price}, degre = ${beer.degre}, 
        volume = ${beer.volume}, isAvaible = ${beer.isAvaible} 
        WHERE id = ${beer.id}`,
        (err) => {
            if (err) console.log(err)
            if (callback != undefined) callback(err)
        })
}

function removeBeer(beerId, callback) {
    // Set isAvaible to 2
    db.run(`UPDATE Beers SET isAvaible = ${2} WHERE id = ${beerId}`,
        (err) => {
            if (err) console.log(err)
            if (callback != undefined) callback(err)
        })
}

function getPartyDate() {
    let td = new Date();
    let day = td.getDate();
    let mounth = td.getMonth();
    if (td.getHours() < 10) {
        day--;
        if (day == 0) {
            day = new Date(td.getFullYear(), mounth, 0).getDate();
            mounth--;
        }
    }
    mounth++;
    return day + "-" + mounth + "-" + td.getFullYear();
}

function getPurchases(callback) {
    db.all("SELECT * FROM Shopping", (err, rows) => {
        if (err) console.log(err)
        if (callback != undefined) callback(err, rows)
    })
}

function buy(pseudo, beerId, number, callback) {
    db.run(`INSERT INTO Shopping 
        (pseudo, beerId, date, number) 
        values (${pseudo},${beerId},${getPartyDate()},${number})`,
    (err) => {
        if (err) {console.log(err);if (callback != undefined) callback(err)}
        else {
            db.run(`UPDATE Users SET croix = croix + ${number}*(SELECT price FROM Beers WHERE Beers.id = ${beerId}) WHERE pseudo = "${pseudo}"`,
                (err) => {
                    if (err) console.log(err)
                    if (callback != undefined) callback(err)
                })
        }
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
    addBeer: addBeer,
    updateBeer: updateBeer,
    removeBeer: removeBeer
}

module.exports.shopping = {
    buy: buy,
    getPurchases: getPurchases
}