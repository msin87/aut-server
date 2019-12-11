'use strict';

const assert = require('assert').strict;

const cache = dbNames => this.dbNames = dbNames.filter(name => !(this.dbNames ? this.dbNames.includes(name) : false));

{
    let res = cache(['clients']);
    res = cache(['clients']);
    console.dir(res);
}