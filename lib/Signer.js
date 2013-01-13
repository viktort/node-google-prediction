var crypto = require('crypto');
var fs = require('fs');
var logger = require('feather');
var path = require('path');

module.exports = Signer;

function Signer() {

}

Signer.sign = function(options, cb) {
  if(!options.data) {
    return cb(new Error('expected options.data but got', options));
  }
  var signer = crypto.createSign(process.env.SIGN_ALG);
  var self = this;
  this.getKeyFileString(function(err, key) {
    if(err) {
      return cb(err);
    }
    signer.update(options.data);
    var signature = signer.sign(key, 'base64');
    return cb(null, signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''));//Return in call back inside a byte array
  });
}

Signer.getKeyFileString = function(cb) {
  fs.readFile(path.resolve(__dirname, process.env.PEM_FILE), 'utf8', function(err, keyData) {
    if(err) {
      logger.error('Error reading .pem file. Does the file exist?');
      return cb(new Error(err));
    }
    return cb(null, keyData);
  });
}

Signer.createSignatureInput = function(options) {
  if(!(options.header && options.claim_set)) {
    return false;
  }

  var header = this.base64Encode(options.header);
  var claim_set = this.base64Encode(options.claim_set);

  return header+'.'+claim_set;
}

Signer.base64Encode = function(data) {
  var encoded = new Buffer(JSON.stringify(data)).toString('base64');
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

Signer.createSignedJWT = function(options, cb) {
  var self = this;
  var signatureInput = this.createSignatureInput(options);
  if(!signatureInput) {
    return cb(new Error('Unable to generate a signature input:', signatureInput));
  }
  this.sign({data: signatureInput}, function(err, signature) {
    if(err) {
      return cb(err);
    }
    var header = options.header;
    var claimSet = options.claim_set;
    try {
      var jwt = self.base64Encode(header) + '.' + self.base64Encode(claimSet) + '.' + signature;
      return cb(null, jwt);
    } catch(e) {
      return cb(new Error('Signer.js base64Encode returned error: ', e));
    }
  });
}