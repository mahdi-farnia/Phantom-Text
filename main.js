require('v8-compile-cache');
const { app, BrowserWindow, nativeTheme } = require('electron');
const path = require('path');
const dotenv = require('dotenv');
const Events = require('./modules/Events');

// Set Environment Variable
dotenv.config({
  path: path.join(__dirname, '.env')
});

/**
 * Main Window
 * @type { BrowserWindow }
 */
let mainWindow;

const Ready = () => {
  const { WIDTH, HEIGHT, MAIN_HTML_FILE_PATH } = process.env;

  mainWindow = new BrowserWindow({
    width: +WIDTH,
    height: +HEIGHT,
    title: 'Phantom Text',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      spellcheck: false
    }
  });

  // Load App
  mainWindow.loadFile(MAIN_HTML_FILE_PATH);

  // Quit App After Closing Main Window
  mainWindow.on('close', () => app.quit());
};

// After Chrome Opened, Load App
app.whenReady().then(Ready);

// On MacOS After Activate Window, Window Will Restore
app.on('activate', () => mainWindow.isMinimizable() && mainWindow.restore());

// Use When Window Focused Fast Encode
app.on('browser-window-focus', () => sendToMain(Events.BROWSER_FOCUSED));

// Detect Theme Change
nativeTheme.on('updated', () => {
  sendToMain(
    Events.SYSTEM_THEME_CHANGED,
    nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
  );
});

function sendToMain(channel, ...data) {
  mainWindow.webContents.send(channel, ...data);
}
