const { app, BrowserWindow } = require('electron');
const path = require('path');
const AbletonLive = require('./app/model/ableton_live');


const daw = new AbletonLive();


function createWindow () {
  const win = new BrowserWindow({
    width: 1500,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  daw.electronUi = win;

  win.loadFile('app/view/index.html');
  win.webContents.openDevTools();

  win.on("closed", () => {
    daw.controller.clearGridDisplay(8);
  });
}

app.whenReady().then(() => {

  daw.connectToGrid().then((msg) => {
    console.log(msg);
    daw.follow();

    // The grid needs a moment to be fully ready. Wait half a second, then simulate a key press
    // to set the grid to the track 1, rhythm page.
    setTimeout(() => {
      daw.controller.keyPress({x: 0, y: 7, s: 1});
      daw.controller.keyPress({x: 6, y: 7, s: 1});
    }, 500);
  });

}).then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
