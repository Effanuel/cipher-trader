const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
require('../../server/dist/app');
const path = require('path');
const isDev = require('electron-is-dev');

// electron.session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
//   callback({
//     responseHeaders: {
//       ...details.responseHeaders,
//       'Content-Security-Policy': ["default-src 'none'"],
//     },
//   });
// });

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {nodeIntegration: true},
  });
  const url = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
  mainWindow.webContents.openDevTools();

  mainWindow.loadURL(url);
  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
