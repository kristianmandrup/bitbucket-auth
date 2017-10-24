function sendRequest(opts = {}) {
  let {
    uri,
    domain,
    payload,
    consumerKey,
    consumerSecret
  } = opts

  return new Promise(function (resolve, reject) {
    const uri = `https://${domain}/site/oauth2/access_token`
    const handlerOpts = Object.assign(opts, {
      resolve,
      reject
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
  const {
    saveConfig,
    config,
    resolve,
    reject,
    errorMessageOn401
  } = opts
  return function (err, res) {
    if (res && res.ok) {
      var newConfig = Object.assign(config, {
        refreshToken: res.body.refresh_token
      })
      if (saveConfig) {
        saveConfig(newConfig, opts)
      }
      resolve(res.body.access_token)
    } else {
      var errorMessage
      if (res && res.status === 401) {
        errorMessage = errorMessageOn401
      } else if (err) {
        errorMessage = err
      } else {
        errorMessage = res.text
      }
      reject(errorMessage)
    }
  }
}

module.exports = {
  sendRequest,
  createRequestHandler
}
