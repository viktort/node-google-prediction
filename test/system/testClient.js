var assert = require('assert');
var Client = require('../../index');
var config = require('../../config');
var client = null;
var token = null;

process.nextTick(function() {
  (new TestClient).getToken();
});

function TestClient() {
  client = new Client({
    claimSetISS: config.test_jwt_claim_set_iss,
    path: config.test_pem_file
  });
}

TestClient.prototype.getToken = function() {
  var self = this;
  client.accessTokenRequest(function(err, data) {
    if(err) {
      throw new Error(err);
    }
    console.log('\nGet Token data:\n----------------------------------------------------\n', data);
    console.log('\ndata.access_token:\n----------------------------------------------------\n' , data.access_token);
    token = data.access_token;
    console.log('\ntoken:\n----------------------------------------------------\n', token);
    if(!token) {
      throw new Error('No access token found in response ')
    }
    assert.ok(!data.error);
    var options = {token: token, id: config.test_modelID};

    self.getModelStatus(options);
  });
}

TestClient.prototype.getModelStatus = function(options) {
  var self = this;
  client.get(options, function(getErr, getData, getResponse) {
    if(getErr) {
      throw new Error(getErr);
    }
    console.log('\nTraining status:\n----------------------------------------------------\n', getData);
    console.log('Training status for model id', options.id, ':', getData.trainingStatus,'\n');
    options.body = config.test_predict_request;
    self.predict(options);
  });
}

TestClient.prototype.predict = function(options) {
  var self = this;
  client.predict(options, function(err, data, response) {
    if(err) {
      throw new Error(err);
    }
    console.log(data);
    assert.ok(data.id = config.test_modelID);

    // Ideally you will not run this every time you run tests as this will retrain the model and this can take some time to complete.
    // You can still query a trained model as the data is being trained!
    if(config.test_storage_data_location != '') {
      self.insert({id: options.id, token: options.token, storageDataLocation: config.test_storage_data_location});
    } else {
      self.analyze();
    }
  });
}

TestClient.prototype.insert = function(options) {
  var self = this;
  client.insert(options, function(err, data, response) {
    if(err) {
      throw new Error(err);
    }
    console.log(data);
    delete options.storageDataLocation;
    client.get(options, function(err, data, response) {
      if(err) {
        throw new Error(err);
      }
      console.log('\nTraining status\n----------------------------------------------------\n', data);
      console.log('Training status for model id', options.id, ':', data.trainingStatus,'\n');
      assert.ok(data.trainingStatus == 'RUNNING');
      self.analyze();
    });
  });
}

TestClient.prototype.analyze = function() {
  var self = this;
  client.analyze({token: token, id: config.test_modelID}, function(err, data, response) {
    if(err) {
      throw new Error(err);
    }
    console.log('\nAnalyze Data:\n----------------------------------------------------\n', data);
    assert.equal(data.kind, 'prediction#analyze');
    self.list();
  });
}

TestClient.prototype.list = function() {
  var self = this;
  client.list({token: token}, function(err, data, response) {
    if(err) {
      throw new Error(err);
    }
    console.log('Data =', data);
    assert.equal(data.kind, 'prediction#list');
    self.revokeToken({token: token})
  });
}

TestClient.prototype.revokeToken = function(options) {
  var self = this;
  client.revokeToken(options, function(err, data, response) {
    if(err) {
      throw new Error(err);
    }
    assert.ok(response.statusCode == '200');
    console.log(data);
    console.log('testClient.js: Tests passed!');
    process.exit(0);
  });
}