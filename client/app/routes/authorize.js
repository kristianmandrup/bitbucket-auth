const {
  log,
  error
} = console

const {
  buildUrl
} = require('../util')
const {
  authServer,
  client
} = require('./constants')

function createAuthorize(config = {}) {
  let {
    authState,
    accessToken
  } = config

  return function authorize(req, res) {
    var authorizeUrl = buildUrl(authServer.authorizationUrl, {
      response_type: 'code',
      client_id: client.client_id,
      redirect_uri: client.redirect_uri
    });

    // start the OAuth2 flow
    res.redirect(authorizeUrl);
  }
}

module.exports = {
  createAuthorize
}
