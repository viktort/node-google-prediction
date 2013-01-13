module.exports = {
  GOOGLE_TOKEN_REQUEST_URI: "https://accounts.google.com/o/oauth2/token",
  GOOGLE_CLOUD_STORAGE_URI: "https://www.googleapis.com/auth/devstorage.read_only",
  GOOGLE_PREDICTION_API_URI:"https://www.googleapis.com/auth/prediction",
  GOOGLE_REVOKE_TOKEN_REQUEST_URI: "https://accounts.google.com/o/oauth2/revoke",
  GOOGLE_TRAINED_MODELS_URI: "https://www.googleapis.com/prediction/v1.5/trainedmodels",
  SIGN_ALG: "RSA-SHA256",
  JWT_HEADER_ALG: "RS256",
  JWT_HEADER_TYP: "JWT",
  // RSA SHA256 of {"alg":"RS256","typ":"JWT"}
  // Ref: https://developers.google.com/accounts/docs/OAuth2ServiceAccount#jwtcontents
  // As this is always the same the base64 value of it is provided directly!
  JWT_HEADER: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9",
  //aud value is always the same
  JWT_CLAIM_SET_AUD: "https://accounts.google.com/o/oauth2/token",
  GRANT_TYPE: "urn:ietf:params:oauth:grant-type:jwt-bearer",

  // ---------------------------- For testing purposes only ------------------------------------ //

  //This is the email address belonging to the service account - place in here for tests to run
  test_jwt_claim_set_iss: "471875788466@developer.gserviceaccount.com",
  //This is absolute path to your .pem file
  test_pem_file: "sdfsdfs",
  test_modelID: "dfdsfds",
  test_storage_data_location: "",
  test_predict_request: ""
}