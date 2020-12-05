const { ipcMain } = require('electron/main');
const Events = require('./Events');
const { encode, decode } = require('./crypto');

/**
 * @type {(channel: string, ...data: any[]) => void}
 */
let sendToMain;

// Encode
ipcMain.on(Events.REQUEST_ENCODE, (e, data) => {
  sendToMain(Events.GET_ENCODED, encode(data));
});

// Decode
ipcMain.on(Events.REQUEST_DECODE, (e, data) => {
  sendToMain(Events.GET_DECODED, decode(data));
});

module.exports = function (sendFn) {
  sendToMain = sendFn;
};
