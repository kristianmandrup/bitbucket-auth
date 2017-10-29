let {
  errorHandler,
  createValidator,
  defaults,
  populateDefaults,
  setErrorHandler
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
  errorHandler = setErrorHandler('getAccessToken', opts)
  opts = populateDefaults(opts)
  const validate = createValidator('getAccessToken')
  validate(opts)

  const {
    loadConfig,
    storage,
    configPath
  } = opts
  const logger = opts.logger || defaults.logger
  const log = logger('getAccessToken', opts)

  const loadFromStorage = storage.loadConfig.bind(storage) || loadConfig
  let config = loadFromStorage ? loadFromStorage(opts) : {}
  opts = Object.assign({}, {
    configPath,
    config,
    logger,
    domain: defaults.domain
  }, opts)

  let {
    credentialsProvider,
    refreshToken
  } = config

  credentialsProvider = credentialsProvider || opts.credentialsProvider
  refreshToken = refreshToken || opts.refreshToken
  useRefreshToken = opts.useRefreshToken || useRefreshToken
  log({
    refreshToken,
    credentialsProvider
  })
  if (useRefreshToken({
      refreshToken,
      credentialsProvider
    })) {
    opts.refreshToken = refreshToken
    return getTokens(opts)
  }

  if (credentialsProvider) {
    return credentialsProvider().then(function (credentials) {
      opts = Object.assign(opts, credentials)
      return getTokens(opts)
    })
  }
  // fall back
  errorHandler('opts must specify a credentialsProvider or a refreshToken', {
    opts
  })
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
  } = opts

  const errorHandler = setErrorHandler('getTokens', opts)
  const logger = opts.logger || defaults.logger
  const log = logger('getTokens', opts)

  if (username) {
    payload = {
      grant_type: 'password',
      username,
      password
    }
    errorMessageOn401 += ' Bad username/password?'
    log('prepared for Basic auth', {
      payload,
      errorMessageOn401
    })
  } else if (refreshToken) {
    payload = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }
    errorMessageOn401 += ' Bad refresh token?'
    log('prepared for refresh token', {
      payload,
      errorMessageOn401
    })
  } else {
    errorHandler('opts must specify either username and password, or refreshToken')
  }
  const requestOpts = Object.assign(opts, {
    errorMessageOn401,
    payload
  })

  // enable override of sendRequest
  return (opts.sendRequest || sendRequest)(requestOpts)
}

function useRefreshToken(config) {
  const {
    refreshToken,
    forceCredentials
  } = config
  return refreshToken && !forceCredentials
}

module.exports = {
  getAccessToken,
  getTokens,
  useRefreshToken
}
