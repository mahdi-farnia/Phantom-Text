const CryptoJs = require('crypto-js');

const { Rabbit, enc } = CryptoJs;
const error = { error: true };
let KEY = null;

module.exports = {
  setKey(key) {
    KEY = key;
    return this;
  },
  genKey() {
    const salt = CryptoJs.lib.WordArray.random(128 / 8);

    return CryptoJs.PBKDF2(process.env.CRYPTO_PBKDF2_KEY, salt, {
      keySize: 8 / 8
    }).toString(enc.Base64);
  },
  encode(text) {
    if (!text || !KEY) return error;

    return { data: Rabbit.encrypt(text, KEY).toString() };
  },
  decode(text) {
    try {
      return { data: Rabbit.decrypt(text, KEY).toString(enc.Utf8) };
    } catch (err) {
      return error;
    }
  }
};
