const { ipcMain } = require('electron/main');
const Events = require('./Events');
const { encode, decode, setKey, genKey } = require('./crypto');

/**
 * @type {(channel: string, ...data: any[]) => void}
 */
let sendToMain, setAlwaysOnTop, setMinSize;

// Start App
ipcMain.once(Events.APP_LOADED, () => {
  sendToMain(Events.SYSTEM_INFO, { isDarwin: process.platform === 'darwin' });
});

// Get Key
ipcMain.on(Events.REGISTER_KEY, (e, key) => {
  setKey(key);
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

// Set Min Height & Width
ipcMain.on(Events.SET_MINIMUM_SIZE, (e, { isLarger }) => {
  const {
    MIN_WIDTH,
    MIN_HEIGHT,
    MIN_WIDTH_LARGE,
    MIN_HEIGHT_LARGE
  } = process.env;

  if (isLarger) {
    setMinSize({
      width: +MIN_WIDTH_LARGE,
      height: +MIN_HEIGHT_LARGE
    });
  } else {
    setMinSize({
      width: +MIN_WIDTH,
      height: +MIN_HEIGHT
    });
  }
});

ipcMain.on(Events.GENERATE_KEY, () =>
  sendToMain(Events.GENERATED_KEY, genKey())
);

// Import Using Require :))))
module.exports = function ({
  sendToMain: send,
  setAlwaysOnTop: onTop,
  setMinSize: setSize
}) {
  sendToMain = send;
  setAlwaysOnTop = onTop;
  setMinSize = setSize;
};
