const { app, BrowserWindow, Menu, ipcMain } = require('electron');

const url = require("url");
const path = require("path");

let db = require('./js/db.js');

app.allowRendererProcessReuse = false;

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    mainWindow.setFullScreen(true);

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `./dist/index.html`),
            protocol: "file:",
            slashes: true
        })
    );
    mainWindow.on('closed', function () {
        mainWindow = null
    })

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu)
}
// console.log(app);
app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

ipcMain.on('close', () => {
    app.quit()
})

function formatResponse(err, data) {
    if (err) return {
        'error' : true,
        'errorMessage' : err.errno,
        'data' : null
    }
    else return {
        'error' : false,
        'data' : data
    }
}

// Users

ipcMain.on('getUsers', (event) => {
    db.users.getUsers((err, users) => {
        event.reply('getUsersReply', formatResponse(err, users));
    })
})

ipcMain.on('getPseudos', (event) => {
    db.users.getPseudos((err, pseudos) => {
        event.reply('getPseudosReply', formatResponse(err, pseudos));
    })
})

ipcMain.on('getUser', (event, user) => {
    db.users.getUser((err, user) => {
        event.reply('getUserReply', err, user)
    })
})

ipcMain.on('addUser', (event, user) => {
    db.users.addUser(user, (err) => {
        event.reply('addUserReply', formatResponse(err))
    })
})

function updateUser(user) {
    return new Promise(resolve => {
        db.users.updateUser(user, (err) => {
            resolve(err);
        })
    })
}

ipcMain.on('updateUser', (event, user) => {
    db.users.updateUser(user, (err) => {
        event.reply('updateUserReply', err)
    })
})

async function updateUsers(users) {
    let err;
    for (let i = 0; i < users.length; i++) {
        err = await updateUser(users[i]);
        if (err) {
            return err;
        }
    }
}

ipcMain.on('updateUsers', (event, users) => {
    console.log("Update Users");
    updateUsers(users).then((err) => {
        event.reply('updateUsersReply', formatResponse(err));
    });
    // var results = Promise.all(users.map(updateUser));
    // results.then((data) => {
    //     console.log(data);
    //     event.reply('updateUsers', formatResponse(err))
    // })
    // db.users.updateUser(user, (err) => {
    //     event.reply('updateUsersReply', err)
    // })
})

ipcMain.on('removeUser', (event, pseudo) => {
    db.users.removeUser(pseudo, (err) => {
        event.reply('removeUserReply', err)
    })
})

// ipcMain.on('addRond', (event, pseudo, number) => {
//     db.users.addRond(pseudo, number, (err) => {
//         event.reply('addRondReply', err)
//     })
// })

// ipcMain.on('addCroix', (event, pseudo, number) => {
//     db.users.addCroix(pseudo, number, (err) => {
//         event.reply('addCroixReply', err)
//     })
// })

// ipcMain.on('resetCroix', (event) => {
//     db.users.resetCroix((err) => {
//         event.reply('resetCroixReply', err)
//     })
// })

// // Beers

// ipcMain.on('getBeers', (event) => {
//     db.beers.getBeers((err, beers) => {
//         event.reply('beers', err, beers)
//     })
// })

// ipcMain.on('addBeer', (event, beer) => {
//     db.beers.addBeer(beer, (err) => {
//         event.reply('addBeerReply', err)
//     })
// })

// ipcMain.on('updateBeer', (event, beer) => {
//     db.beers.updateBeer(beer, (err) => {
//         event.reply('updateBeerReply', err)
//     })
// })

// ipcMain.on('removeBeer', (event, beerId) => {
//     db.beers.removeBeer(beerId, (err) => {
//         event.reply('removeBeerReply', err)
//     })
// })

// // Shopping

// ipcMain.on('getPurchases', (event) => {
//     db.shopping.getPurchases((err, purchases) => {
//         event.reply('getPurchasesReply', err, purchases)
//     })
// })

// ipcMain.on('buy', (event, pseudo, beerId, number) => {
//     db.shopping.buy(pseudo, beerId, number, (err) => {
//         event.reply('buyReply', err)
//     })
// })


const mainMenuTemplate = [
    {
        label: 'Dev',
        submenu: [
            {
                label: 'Dev Tools',
                accelerator: 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    }
];

