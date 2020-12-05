require('v8-compile-cache');
const { join: joinPath } = require('path');
const dotenv = require('dotenv');

// Set Environment Variable
dotenv.config({
  path: joinPath(__dirname, '.env')
});
