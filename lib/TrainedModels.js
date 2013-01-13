var client = require('./Client');
var helper = require('./Helper');
var logger = require('feather');
var config = require('../config');
//@TODO emit event when the training is done - we can alert or monitor when training is done - even get an email.

module.exports = TrainedModels;

function TrainedModels() {
}

//@TODO here we would want to make this flexible too by passing in the model id
//Let the model ids be config constant values.
TrainedModels.insert = function (trainedModelID, cb) {

  var uri = config.GOOGLE_TRAINED_MODELS_URI;

  //@TODO the fields to be passed in the config when publishing the module
  var query = {
    fields:'id,trainingComplete,trainingStatus,trainingInstances,created,selfLink'
  }

  var body = {
    id: trainedModelID,
    storageDataLocation: storageDataLocation.getLocationForModel(trainedModelID)
  }

  var headers = {
    "Content-Type":"application/json",
    "Authorization":"Bearer " + tokenStore.getToken()
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

//@TODO obviously we need to pass in the id of the model trained here
TrainedModels.get = function(trainedModelsID, cb) { //@todo pass in options with trainedModelsID and token - now is up to the user to cache the token

  var uri = config.GOOGLE_TRAINED_MODELS_URI+'/'+trainedModelsID;
  var token = tokenStore.getToken();

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
  if(options.body) {
    Object.keys(options.body).forEach(function(key) {
      console.log('options.body[',key,'] =', options.body[key] );
      body.input.csvInstance.push(options.body[key]);
    });

    var uri = config.GOOGLE_TRAINED_MODELS_URI+'/'+trainedModelsID+'/predict';
    var headers = {
      "Content-Type":"application/json",
      "Authorization":"Bearer " + tokenStore.getToken()
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

TrainedModels.request = function(options, cb) {
  helper.request(options, function(err, data, response) {
    if(err) {
      return cb(err);
    }
    return cb(null, data, response);
  });
}