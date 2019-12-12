'use strict';
const assert = require('assert').strict;

const memoized = memoize(nedbAsync);
module.exports = memoized;
