const CryptoJs = require('crypto-js');

const { Rabbit, enc } = CryptoJs;
const error = { error: true };
const KEY = 'test';

module.exports = {
  encode(text) {
    if (!text) return error;

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
