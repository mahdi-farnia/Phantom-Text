require('./modules/setup');
const { app, BrowserWindow, nativeTheme } = require('electron/main');
const Events = require('./modules/Events');

/**
 * Main Window
 * @type { BrowserWindow }
 */
let mainWindow;

const Ready = () => {
  const {
    WIDTH,
    HEIGHT,
    MIN_WIDTH,
    MIN_HEIGHT,
    MAIN_HTML_FILE_PATH
  } = process.env;

  mainWindow = new BrowserWindow({
    width: +WIDTH,
    height: +HEIGHT,
    minWidth: +MIN_WIDTH,
    minHeight: +MIN_HEIGHT,
    title: 'Phantom Text',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      spellcheck: false,
      enableRemoteModule: true
    }
  });

  // Load App
  mainWindow.loadFile(MAIN_HTML_FILE_PATH);

  // Quit App After Closing Main Window
  mainWindow.on('close', () => app.quit());
};

// Load App, After Chrome Opened
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

// IPC
require('./modules/ipc')(sendToMain);

// Send Message To Main Window
function sendToMain(channel, ...data) {
  mainWindow.webContents.send(channel, ...data);
}
