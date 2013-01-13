var request = require('request');
var qs = require('querystring');
var util = require('util');

module.exports = Helper;

function Helper() {
}

Helper.request = function(options, cb) {
  var headers = {};
  var uri = options.uri;
  var self = this;

  if (options.query) {
    uri += '?' + qs.stringify(options.query);
  }

  var body;
  if (options.body && options.headers && /urlencoded/.test(options.headers['Content-Type'])){
    body = qs.stringify(options.body);
  } else if( options.body && options.headers && /json/.test(options.headers['Content-Type'])) {
    body = JSON.stringify(options.body)
  }

  var options = {
    method  : options.method || 'GET',
    headers : options.headers || 'application/json',
    uri     : uri,
    body    : body
  };

  console.log('options in request =', options);
  request(options, function(err, response, body) {
    if (err) {
      console.log(err);
      return cb(err);
    }

    if(body) {
      try{
        var json = JSON.parse(body);
        cb(null, json, response);
      } catch (err) {
        return cb(self.unexpectedResultError(body, 'Invalid JSON response'));
      }
    } else {
      //We got an empty response with empty body - still return Okay. Example is request to google revoke token api which return 200OK with empty body
      return cb(null, null, response);
    }
  });
}

Helper.unexpectedResultError = function(result, message) {
  message = message || 'Unexpected result';

  var err = new Error(
      message + ':\n' +
          '------------------------------------------------------------------------\n' +
          util.inspect(result) + '\n' +
          '------------------------------------------------------------------------'
  );

  // Make sure our stack trace does not include this function itself
  Error.captureStackTrace(err, exports.unexpectedResultError);

  return err;
};