const {
  log,
  error
} = console

function createAuthenticated(config = {}) {
  let {
    authState,
    accessToken
  } = config

  return function authenticated(request, response) {
    const {
      query
    } = request
    const {
      code,
      state
    } = query
    log('authenticated', {
      query,
      code
    })

    if (state !== authState.state) {
      // If the state value doesn’t match what we’re expecting,
      // that’s a very good indication that something "fishy" is happening,
      // such as a session fixation attack
      res.render('error', {
        error: 'State value did not match'
      })
      return;
    }

    // Make a HTTP form encoded request and authenticate client using HTTP Basic Auth
    // Can be done using getAccessToken()
    // Will use refreshToken if available in storage
    getAccessToken({
      appName: 'my-app',
      storage
    }).then(result => {
      // result contains accessToken and refreshToken
      accessToken = result.accessToken
      // redirect to some page?
    }).error(err => {
      // TODO: use getAccessToken with forceCredentials?
      // potentially regenerate auth state?
      // authState.generate()
    })
  }
}

module.exports = {
  createAuthenticated
}
