var crypto = require('./Signer');
var date = require('./utils/date');
var logger = require('feather');
var helper = require('./Helper');
var config = require('../config');

module.exports = Client;

function Client() {

}

Client.accessTokenRequest = function(cb) {
  var options = {
    header: {
      alg: config.JWT_HEADER_ALG,
      typ: config.JWT_HEADER_TYP
    },
    claim_set: {
      iss: config.JWT_CLAIM_SET_ISS,
      scope: config.GOOGLE_CLOUD_STORAGE_URI + ' ' + config.GOOGLE_PREDICTION_API_URI,
      aud: config.JWT_CLAIM_SET_AUD,
      exp: date.addHours(1), //get time in seconds
      iat: date.getEpochTime()
    }
  }

  crypto.createSignedJWT(options, function(err, jwt) {
    if(err) {
      return cb(err);
    }

    var body = {
      grant_type: config.GRANT_TYPE,
      assertion: jwt
    }

    var headers = {"Content-Type": 'application/x-www-form-urlencoded'};
    var uri = config.GOOGLE_TOKEN_REQUEST_URI;

    var options = {
      method: 'POST',
      headers: headers,
      uri: uri,
      body: body
    };

    helper.request(options, function(err, body, response) {
      if (err) {
        logger.error(err);
        return cb(err);
      }
      logger.info('access token response body =', body);
      cb(null, body, response);
    });
  });
}

Client.revokeToken = function(options, cb) {
  if(!options.token) {
    return cb(new Error('Client.revokeToken: No token found in options ', options));
  }

  var token = options.token;
  var headers = {"Content-Type": 'application/x-www-form-urlencoded'};

  var options = {
    uri: config.GOOGLE_REVOKE_TOKEN_REQUEST_URI,
    body: {
      token: token
    },
    method: 'POST',
    headers: headers
  }

  helper.request(options, function(err, body, response) {
    if(err) {
      return cb(err);
    }
    if(response.statusCode != '200') {
      return cb('Client.revokeToken() HTTP StatusCode: ' + response.statusCode + ' Not OK!');
    }
    if(body && body.error) {
      return cb(new Error(body));
    }
    return cb(null, 'Successfully revoked token ' + token, response);
  });
}