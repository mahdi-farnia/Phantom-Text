const { ipcMain } = require('electron/main');
const Events = require('./Events');
const { encode, decode } = require('./crypto');

/**
 * @type {(channel: string, ...data: any[]) => void}
 */
let sendToMain, setAlwaysOnTop;

// Start App
ipcMain.once(Events.APP_LOADED, () => {
  sendToMain(Events.SYSTEM_INFO, { isDarwin: process.platform === 'darwin' });
});

// Encode
ipcMain.on(Events.REQUEST_ENCODE, (e, data) => {
  sendToMain(Events.GET_ENCODED, encode(data));
});

// Decode
ipcMain.on(Events.REQUEST_DECODE, (e, data) => {
  sendToMain(Events.GET_DECODED, decode(data));
});

ipcMain.on(Events.ALWAYS_ON_TOP_CHANGE, (e, isActive) =>
  setAlwaysOnTop(isActive)
);

module.exports = function ({ sendToMain: send, setAlwaysOnTop: onTop }) {
  sendToMain = send;
  setAlwaysOnTop = onTop;
};
