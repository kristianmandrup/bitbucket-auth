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
    saveConfig,
    config,
    resolve,
    reject,
    errorMessageOn401,
    logger
  } = opts
  errorMessageOn401 = errorMessageOn401 || 'ERROR:'
  const log = (logger || defaults.logger)('requestHandler', opts)

  function isSuccess(res) {
    return res && res.ok
  }
  isSuccess = opts.isSuccess || isSuccess

  function isUnauthorized(res) {
    res && res.status === 401
  }
  isUnauthorized = opts.isUnauthorized || isUnauthorized

  function handleError(opts = {}) {
    let {
      res,
      err,
      errorMessageOn401,
      reject
    } = opts

    var errorMessage
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
  handleError = opts.handleError || handleError

  function handleSuccess(opts = {}) {
    let {
      res,
      err,
      config,
      body,
      resolve
    } = opts

    var newConfig = Object.assign(config, {
      refreshToken: body.refresh_token
    })
    if (saveConfig) {
      saveConfig(newConfig, opts)
    }
    resolve(body.access_token)
  }
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

module.exports = {
  sendRequest,
  createRequestHandler
}
