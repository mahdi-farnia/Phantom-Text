const CryptoJs = require('crypto-js');

const { Rabbit, enc } = CryptoJs;

module.exports = {
  encode(text) {
    return Rabbit.encrypt(text, 'test').toString();
  },
  decode(text) {
    return Rabbit.decrypt(text, 'test').toString(enc.Utf8);
  }
};
