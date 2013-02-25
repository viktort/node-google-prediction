var client = require('./Client');
var helper = require('./Helper');
var config = require('../config').config;

module.exports = TrainedModels;

function TrainedModels() {
}

TrainedModels.insert = function (options, cb) {
  var id = options.id;
  var token = options.token;
  var storageDataLocation = options.storageDataLocation;

  var uri = config.GOOGLE_TRAINED_MODELS_URI;

  var query = {
    fields: config.MODEL_INSERT_FIELDS != '' ? config.MODEL_INSERT_FIELDS : config.MODEL_INSERT_DEFAULT_FIELDS
  }

  var body = {
    id: id,
    storageDataLocation: storageDataLocation
  }

  var headers = {
    "Content-Type":"application/json",
    "Authorization":"Bearer " + token
  }

  var options = {
    method:'POST',
    uri:uri,
    query:query,
    headers:headers,
    body:body
  }

  this.request(options, cb);
}

TrainedModels.get = function(options, cb) {
  var uri = config.GOOGLE_TRAINED_MODELS_URI+'/'+options.id;
  var token = options.token;

  var headers = {
    "Authorization":"Bearer " + token
  }
  var options = {
    method:'GET',
    uri:uri,
    headers:headers
  }

  this.request(options, cb);
}

TrainedModels.predict = function(options, cb) {
  var trainedModelsID = options.id;
  var body = {input: {csvInstance: []}};
  var token = options.token;
  if(options.body) {
    Object.keys(options.body).forEach(function(key) {
      console.log('options.body[',key,'] =', options.body[key] );
      body.input.csvInstance.push(options.body[key]);
    });

    var uri = config.GOOGLE_TRAINED_MODELS_URI+'/'+trainedModelsID+'/predict';
    var headers = {
      "Content-Type":"application/json",
      "Authorization":"Bearer " + token
    }

    var options = {
      method: 'POST',
      uri: uri,
      headers: headers,
      body: body
    }

    this.request(options, cb);
  } else {
    return cb(new Error('Missing request body'));
  }
}

TrainedModels.analyze = function(options, cb) {
  var trainedModelsID = options.id;
  var token = options.token;
  var uri = config.GOOGLE_TRAINED_MODELS_URI + '/' + trainedModelsID + '/analyze';

  var headers = {
    "Authorization":"Bearer " + token
  }

  var options = {
    method: 'GET',
    uri: uri,
    headers: headers
  }

  this.request(options, cb);

}

TrainedModels.list = function(options, cb) {
  var token = options.token;
  var uri = config.GOOGLE_TRAINED_MODELS_URI + '/list';

  var headers = {
    "Authorization":"Bearer " + token
  }

  var options = {
    method: 'GET',
    uri: uri,
    headers: headers
  }

  this.request(options, cb);

}

TrainedModels.delete = function(options, cb) {
  var token = options.token;
  var uri = config.GOOGLE_TRAINED_MODELS_URI + '/' + options.id;

  var headers = {
    "Authorization":"Bearer " + token
  }

  var options = {
    method: 'DELETE',
    uri: uri,
    headers: headers
  }

  this.request(options, cb);

}

TrainedModels.update = function(options, cb) {
  var token = options.token;
  var uri = config.GOOGLE_TRAINED_MODELS_URI + '/' + options.id;
  var body = {
    label: options.label || '',
    output: options.output || '',
    csvInstance: options.updateData
  }

  var headers = {
    "Content-Type":"application/json",
    "Authorization":"Bearer " + token
  }

  var options = {
    method: 'PUT',
    uri: uri,
    body: body,
    headers: headers
  }

  this.request(options, cb);
}

TrainedModels.request = function(options, cb) {
  helper.request(options, function(err, data, response) {
    if(err) {
      return cb(err);
    }
    return cb(null, data, response);
  });
}