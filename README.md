node-google-prediction
======================

A node.js client for the Google Prediction API - To be used for Server to Server applications.
**MIT license**

## v0.0.3~beta

A more extensive implementation to follow.

## Integrates with Google Prediction API v1.5

## Introduction

This is a node client library that abstracts the lower level integration implementation with the google prediction API
and allows you to get up and running quickly and start using the api to your business benefit.

This client makes it easy to authenticate using OAuth2 by using the private key given to you by Google when you created
your [service account](https://developers.google.com/accounts/docs/OAuth2ServiceAccount#libraries).

Google at present do not provide their own Node.js client which was the motivation for creating this client.

So if you want to create a web service application, this is a perfect library to get you started as this will allow you
to utilise your service account details to authenticate and use the prediction API.

## Prerequisites
I assume you have read and have a good understanding of all that is covered in [Google Prediction API](https://developers.google.com/prediction/docs/getting-started)
[developer guide](https://developers.google.com/prediction/docs/developer-guide). This will help in understanding and using this library successfully.

## Installation

```npm install node-google-prediction```

## Usage

```js
    var Client = require('node-google-prediction-api');
    var client = new Client({claimSetISS        : //The Service Account email. Check your Gogole Console -> API Access,
                             path               : //Absolute path to the service account private key (in .pem format)
                             modelInsertFields  : //Defaults are provided in config/config.js but you may want to provide different ones});

    ...

    client.accessTokenRequest(function(err, data, response) {
      if(err) {
        throw new Error(err);
      }
      console.log(data);
      var token = data.access_token;
      // Cache your token as it is valid for 1 hour and you can reuse. Only make a fresh token request if HTTP401 is received.
      // **Note** is down to you to cache and reuse an access token correctly so ensure you handle HTTP401 in other calls to Client.
    });

    //**Hint:** Look at test/system/testClient for further usage details.
```

## Running tests
Due to the nature of the Google Prediction API, in order to run tests you will need to provide some details withing
config/config.js. This is so you can provide your own Service Account details and test your own trained models.
