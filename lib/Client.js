var crypto = require('./Signer');
var date = require('./utils/date');
var logger = require('feather');
var helper = require('./Helper');
var config = require('../config').config;
var TrainedModels = require('./TrainedModels');
var errors = require('../config').errors;

module.exports = Client;

function Client(options) {
  this.options = options || '';
  if(!this.options.pemPath || !this.options.claimSetISS) {
    throw errors.NO_PATH_TO_PEM_FILE_PROVIDED;
  }
  this.path = this.options.pemPath;
  this.claimSetISS = this.options.claimSetISS;
  config.MODEL_INSERT_FIELDS = this.options.modelInsertFields || '';
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
  this._trainedModelsCaller('get', options, cb);
}

Client.prototype.predict = function(options, cb) {
  this._trainedModelsCaller('predict', options, cb);
}

Client.prototype.analyze = function(options, cb) {
  this._trainedModelsCaller('analyze', options, cb);
}

Client.prototype.list = function(options, cb) {
  this._trainedModelsCaller('list', options, cb);
}

Client.prototype.delete = function(options, cb) {
  this._trainedModelsCaller('delete', options, cb);
}

Client.prototype.insert = function(options, cb) {
  if(!options.storageDataLocation) {
    return cb(errors.NO_STORAGE_DATA_LOCATION_ERROR);
  }
  this._trainedModelsCaller('insert', options, cb);
}

Client.prototype.update = function(options, cb) {
  if(!options.updateData) {
    return cb(errors.NO_UPDATE_DATA_PROVIDED_FOR_UPDATE);
  }
  this._trainedModelsCaller('update', options, cb);
}

Client.prototype._trainedModelsCaller = function(method, options, cb) {
  if(!options.id && method != 'list') {
    return cb(errors.NO_ID_PROVIDED_ERROR);
  }
  if(!options.token) {
    return cb(errors.NO_TOKEN_PROVIDED_ERROR)
  }
  TrainedModels[method](options, function(err, data, response) {
    if(err) {
      return cb(err);
    }
    return cb(null, data, response);
  });
}