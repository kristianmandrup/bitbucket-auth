const request = require('superagent')
let {
  errorHandler,
  createValidator,
  defaults,
  populateDefaults
} = require('./util')

const {
  sendRequest,
  createRequestHandler
} = require('./request')

/**
 *
 * Retrieve access token from server
 * uses Basic Auth (username/password) POST request
 *
 * @param {String} appName Name of app
 * @param {String} consumerKey Auth username
 * @param {String} consumerSecret Auth password
 * @param {String} refreshToken (optional)
 * @param {Boolean} forceCredentials To force re-retrieval of token credentials (optional)
 * @param {String} logger To log messages (optional)
 * @param {Function} credentialsProvider Custom credentials provider function (optional)
 * @param {Function} errorHandler To handle any error (optional)
 */
function getAccessToken(opts = {}) {
  errorHandler = setErrorHandler(opts)
  opts = populateDefaults(opts)
  createValidator('getAccessToken')
    .validateOpts(opts)
  const {
    loadConfig
  } = opts
  const logger = opts.logger || defaults.logger

  let config = loadConfig ? loadConfig(opts) : {}
  opts = Object.assign({}, {
    configPath,
    config,
    logger,
    domain: 'bitbucket.org'
  }, opts)

  const {
    refreshToken,
    forceCredentials,
    credentialsProvider
  } = config

  if (refreshToken && !forceCredentials) {
    opts.refreshToken = refreshToken
    return getTokens(opts)
  } else if (credentialsProvider) {
    return credentialsProvider().then(function (credentials) {
      opts = Object.assign(opts, credentials)
      return getTokens(opts)
    })
  } else {
    errorHandler('opts must specify a credentialsProvider')
  }
}

/**
 *
 * Retrieve access token from server
 * uses Basic Auth (username/password) POST request
 *
 * @param {String} consumerKey (username)
 * @param {String} consumerSecret (password)
 * @param {String} refreshToken
 * @param {String} domain On bitbucket
 * @param {String} logger To log messages
 * @param {Object} config Configuration
 * @param {String} configPath Path to store configuration
 */
function getTokens(opts = {}) {
  let payload
  let errorMessageOn401 = 'getTokens: Authentication failed!'
  // TODO: potentially add options validation here as well
  const {
    username,
    password,
    refreshToken,
    consumerKey,
    consumerSecret,
    domain,
    configPath,
    config,
    logger,
    saveConfig,
  } = opts

  if (username) {
    payload = {
      grant_type: 'password',
      username,
      password
    }
    errorMessageOn401 += ' Bad username/password?'
  } else if (refreshToken) {
    payload = {
      grant_type: 'refresh_token',
      refresh_token
    }
    errorMessageOn401 += ' Bad refresh token?'
  } else {
    errorHandler('opts must specify either username and password, or refreshToken')
  }

  // enable override of sendRequest
  return (opts.sendRequest || sendRequest)({
    uri,
    domain,
    payload,
    config,
    consumerKey,
    consumerSecret,
    errorMessageOn401
  })
}

module.exports = {
  getAccessToken
}
