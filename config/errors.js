module.exports = {
  NO_ID_PROVIDED_ERROR: new Error('No model ID provided in options. Provide a model ID and try again!'),
  NO_TOKEN_PROVIDED_ERROR:  new Error('No token provided in options. Provide a token and try again!'),
  NO_STORAGE_DATA_LOCATION_ERROR:  new Error('\n ------------------------------------------------------------------------------------------------ \n' +
        'No storage data location in options! Provide one and try again. ' +
        '\n -------- \n ' +
        'This can be obtained from your Google Cloud Storage manager inside the Console->Google Cloud Storage and follow Google Cloud Storage Manager link!'+
        '\n ------------------------------------------------------------------------------------------------ \n')
}