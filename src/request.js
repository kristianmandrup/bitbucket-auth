const request = require('superagent')

import {
  defaults
} from './util'

function sendRequest(opts = {}) {
  let {
    domain,
    payload,
    config,
    consumerKey,
    consumerSecret,
    logger
  } = opts
  const log = (logger || defaults.logger)('sendRequest', opts)
  domain = domain || 'bitbucket.org'
  log({
    domain,
    consumerKey,
    consumerSecret,
    payload
  })
  return new Promise(function (resolve, reject) {
    const uri = `https://${domain}/site/oauth2/access_token`
    const handlerOpts = Object.assign(opts, {
      config,
      resolve,
      reject
    })
    log('sendRequest', {
      uri,
      handlerOpts
    })
    const requestHandler = (opts.createRequestHandler || createRequestHandler)(handlerOpts)
    request
      .post(uri)
      .auth(consumerKey, consumerSecret)
      .accept('application/json')
      .type('form')
      .send(payload)
      .end(requestHandler)
  })
}

function createRequestHandler(opts = {}) {
  let {
    config,
    resolve,
    reject,
    errorMessageOn401,
    logger
  } = opts
  config = config || {}
  errorMessageOn401 = errorMessageOn401 || 'ERROR:'
  const log = (logger || defaults.logger)('requestHandler', opts)

  isSuccess = opts.isSuccess || isSuccess
  isUnauthorized = opts.isUnauthorized || isUnauthorized
  handleError = opts.handleError || handleError
  handleSuccess = opts.handleSuccess || handleSuccess

  return function (err, res) {
    const body = res.body
    log({
      err,
      body
    })
    if (isSuccess(res)) {
      handleSuccess({
        res,
        err,
        body,
        config,
        resolve
      })
    } else {
      handleError({
        res,
        err,
        errorMessageOn401,
        reject
      })
    }
  }
}

function isSuccess(res) {
  return res && res.ok
}

function isUnauthorized(res) {
  res && res.status === 401
}

function handleError(opts = {}) {
  let {
    res,
    err,
    errorMessageOn401,
    reject,
    logger
  } = opts

  const log = (logger || defaults.logger)('handleError', opts)
  let errorMessage
  log({
    res,
    err
  })
  if (isUnauthorized(res)) {
    errorMessage = errorMessageOn401
  } else if (err) {
    errorMessage = err
  } else {
    errorMessage = res.text
  }
  reject(errorMessage)
}

function handleSuccess(opts = {}) {
  let {
    res,
    err,
    config,
    body,
    resolve,
    saveConfig,
    logger
  } = opts
  const log = (logger || defaults.logger)('handleSuccess', opts)
  var newConfig = Object.assign(config, {
    refreshToken: body.refresh_token
  })
  const saveToStorage = storage.saveConfig.bind(storage) || saveConfig

  if (saveToStorage) {
    saveToStorage(newConfig, opts)
  }
  resolve(body.access_token)
}


module.exports = {
  isSuccess,
  isUnauthorized,
  handleError,
  handleSuccess,
  createRequestHandler,
  sendRequest
}
