var crypto = require('./Signer');
var date = require('./utils/date');
var logger = require('feather');
var helper = require('./Helper');
var config = require('../config');
var TrainedModels = require('TrainedModels');
var NO_ID_PROVIDED_ERROR = new Error('No model ID provided in options. Provide a model ID and try again!');
var NO_TOKEN_PROVIDED_ERROR = new Error('No token provided in options. Provide a token and try again!');
module.exports = Client;

function Client(options) {
  this.options = options || '';
  if(!this.options.path) {
    logger.error(Error('No path to .pem suplied to Client.js!'));
  }
  if(!this.options.claimSetISS) {
    logger.error(new Error('No JWT Claim Set ISS supplied to Client.js. \n This is the email address provided with your server account!'));
  }
  this.path = this.options.path || '';
  this.claimSetISS = this.options.claimSetISS || '';
}

Client.prototype.accessTokenRequest = function(cb) {
  var options = {
    header: {
      alg: config.JWT_HEADER_ALG,
      typ: config.JWT_HEADER_TYP
    },
    claim_set: {
      iss: this.claimSetISS,
      scope: config.GOOGLE_CLOUD_STORAGE_URI + ' ' + config.GOOGLE_PREDICTION_API_URI,
      aud: config.JWT_CLAIM_SET_AUD,
      exp: date.addHours(1), //get time in seconds
      iat: date.getEpochTime()
    },
    path: this.path
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

Client.prototype.revokeToken = function(options, cb) {
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

Client.prototype.get = function(options, cb) {
  if(!options.id) {
    return cb(NO_ID_PROVIDED_ERROR);
  }
  if(!options.token) {
    return cb(NO_TOKEN_PROVIDED_ERROR)
  }
  TrainedModels.get(options, function(err, data, response) {
    if(err) {
      return cb(err);
    }
    return cb(null, data, response);
  })
}

Client.prototype.predict = function(options, cb) {
  if(!options.id) {
    return cb(NO_ID_PROVIDED_ERROR);
  }
  if(!options.token) {
    return cb(NO_TOKEN_PROVIDED_ERROR)
  }
  TrainedModels.predict(options, function(err, data, response) {
    if(err) {
      return cb(err);
    }
    return cb(null, data, response);
  });
}

Client.prototype.insert = function(options, cb) {
  if(!options.id) {
    return cb(NO_ID_PROVIDED_ERROR);
  }
  if(!options.token) {
    return cb(NO_TOKEN_PROVIDED_ERROR)
  }
  if(!options.storageDataLocation) {
    return cb(new Error('No storage data location in options! Provide one and try again. ' +
        '\n ------------- \n ' +
        'This can be obtained from your Google Cloud Storage manager inside the Console->Google Cloud Storage and follow Google Cloud Storage Manager link!'))
  }
  TrainedModels.insert(options, function(err, data, response) {
    if(err) {
      return cb(err);
    }
    return cb(null, data, response);
  });
}