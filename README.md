node-google-prediction
======================

A node.js client for the Google Prediction API - To be used for Server to Server applications.

## v0.0.3

## Integrates with Google Prediction API v1.5

## Introduction

This is a [node.js](http://nodejs.org/) client library that abstracts the Google Prediction API integration complexities,
and allows you to get up and running quickly and start using the api to your business benefit.

This client makes it easy to authenticate using OAuth2 by using the private key given to you by Google when you created
your [service account](https://developers.google.com/accounts/docs/OAuth2ServiceAccount#libraries).

Google at present do not provide their own node.js client which was the motivation for creating this client.

So if you want to create a web service application, this is a perfect library to get you started as this will allow you
to utilise your service account details to authenticate and use the prediction API.

## Prerequisites
I assume you have read and have a good understanding of all that is covered in [Google Prediction API](https://developers.google.com/prediction/docs/getting-started)
 & [developer guide](https://developers.google.com/prediction/docs/developer-guide). This will help in understanding and using this library successfully.

## Installation

```npm install node-google-prediction```

## Usage

```js
    var Client = require('node-google-prediction-api');
    var client = new Client({claimSetISS        : //The Service Account email. Check your Gogole Console -> API Access,
                             path               : //Absolute path to the service account private key (in .pem format)
                             modelInsertFields  : //Defaults are provided in config/config.js but you may want to provide different ones
                            });

    ...
    SomeModule.getToken = function(cb) {

      client.accessTokenRequest(function(err, data, response) {
        if(err) {
          return cb(err);
        }

        //You may want to handle response.statusCode if http 401 Unauthorised is received!
        if(response && response.statusCode && response.statusCode > 399) {
          return cb(new Error('HTTP status code: ', response.statusCode));
        }

        var token = data.access_token;
        return cb(null, token);

        // Cache your token as it is valid for 1 hour and you can reuse. Only make a fresh token request if HTTP 401 is received.
        // **Note** is down to you to cache and reuse an access token correctly so ensure you handle HTTP401 in other calls to Client.
      });
    }

```
**Hint:** Look at test/system/testClient.js for further usage/implementation details.

## Running tests
Due to the nature of the Google Prediction API, in order to run tests you will need to provide some details withing
config/config.js. This is so you can provide your own Service Account details and test your own trained models.

When running test/testClient.js it will run a call to Client.js insert() function. **Warning** this will retrain your model.
I have structured the test such that if you don't provide a test Storage Data Location in config/config.js then this test
will not run.

##Creating you .pem file
**Note:** That when creating a Service Account via the Google Console you will be given a .pk12 file. This library works
by passing in a .pem file so you can convert it using openssl by running the following command

```sh
    openssl pkcs12 -in originalKey.p12 -out convertedKey.pem -nodes -clcerts
```
The result will be the key and certificate. You can keep it in one file or split it into two separate files.

## Done & TODOs
Implemented so far:
* get Access Token
* insert
* predict
* get training status
* revoke access token
* analyze
* list
* delete
* More tests around delete - user is expected to handle the response http status code correctly within their server app.

TODO:
* update

## License

Released fully under [MIT license] (http://opensource.org/licenses/MIT)!
