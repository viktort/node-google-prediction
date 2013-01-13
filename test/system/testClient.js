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
    console.log('data =', data);
    console.log('data.access_token =' , data.access_token);
    token = data.access_token;
    console.log('this.token = ', token);
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
    console.log('training status =', getData);
    console.log('\n---------------------------------\n');
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
    self.revokeToken({token: options.token});
  });
}

TestClient.prototype.revokeToken = function(options) {
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

