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
  JWT_HEADER: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9",
  //This is the email address belonging to the service account
  JWT_CLAIM_SET_ISS: "",
  //aud value is always the same
  JWT_CLAIM_SET_AUD: "https://accounts.google.com/o/oauth2/token",
  PEM_FILE: "",
  GRANT_TYPE: "urn:ietf:params:oauth:grant-type:jwt-bearer"
}