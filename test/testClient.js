var test = require('utest');
var assert = require('assert');
var Client = require('../index');
var client = null;
var path = require('path');

test('test Client', {
  'Test getAccessToken': function() {
    var client = new Client({
      claimSetISS:'', // Place the claim set ISS here. This is the email address of your server account.
      path: '' //Place path to your .pem file here
    });

    client.accessTokenRequest(function(err, data) {
      if(err) {
        throw new Error(err);
      }
      console.log('data =', data);
      console.log('data.access_token =' , data.access_token);
      this.token = data.access_token;
      console.log('this.token = ', this.token);
      if(!this.token) {
        throw new Error('No access token found in response ')
      }
      assert.ok(!data.error);
      var self = this;
      console.log(self.token);
      client.revokeToken({token: self.token}, function(err1, body, response) {
        if(err1) {
          throw new Error(err1);
        }
        console.log('response = ', body);
        console.log('response.statusCode = ', response.statusCode);
      });

    });
  }
});