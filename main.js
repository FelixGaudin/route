const { app, BrowserWindow, Menu, ipcMain } = require('electron');

const url = require("url");
const path = require("path");

// let db = require('./js/db.js');

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

ipcMain.on('test', ()=> {
    console.log("IT WORKS");
})

// Users

// ipcMain.on('getUsers', (event) => {
//     db.users.getUsers((err, users) => {
//         event.reply('getUsersReply', err, users)
//     })
// })

// ipcMain.on('getUser', (event) => {
//     db.users.getUser((err, user) => {
//         event.reply('getUserReply', err, user)
//     })
// })

// ipcMain.on('addUser', (event, user) => {
//     db.users.addUser(user, (err) => {
//         event.reply('addUserReply', err)
//     })
// })

// ipcMain.on('updateUser', (event, pseudo, user) => {
//     db.users.updateUser(pseudo, user, (err) => {
//         event.reply('updateUserReply', err)
//     })
// })

// ipcMain.on('removeUser', (event, pseudo) => {
//     db.users.removeUser(pseudo, (err) => {
//         event.reply('removeUserReply', err)
//     })
// })

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

