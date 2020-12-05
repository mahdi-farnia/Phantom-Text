const CryptoJs = require('crypto-js');

const { Rabbit, enc } = CryptoJs;

module.exports = {
  encode(text) {
    if (!text) return { error: true };

    return { data: Rabbit.encrypt(text, 'test').toString() };
  },
  decode(text) {
    try {
      return { data: Rabbit.decrypt(text, 'test').toString(enc.Utf8) };
    } catch (err) {
      return { error: true };
    }
  }
};
