var test = require('utest');
var assert = require('assert');
var date = require('../../lib/utils/date');

test('Test lib/utils/date.js', {
  'test we return correct epoch time in seconds': function() {
    console.log(date.getEpochTime());
    console.log(date.addHours(1));
    assert.ok(date.addHours(1) > date.getEpochTime()+3599);
  }
});