const {
  log,
  error
} = console

function createAuthCallback(config = {}) {
  let {
    authState,
    accessToken
  } = config

  return function authCallback(request, response, next) {
    const {
      query
    } = request
    const {
      code,
      state
    } = query
    log('authorized by bitbucket', {
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

    // TODO: should also send generated state and perhaps redirect_uri
    getAccessToken({
      appName: 'my-app',
      storage
    }).then(result => {
      // result contains accessToken and refreshToken
      let {
        accessToken,
        refreshToken
      } = result
      log('retrieved', result)
    }).catch(err => {
      // regenerate auth state
      log('ERROR: access_token could not be retrieved', err)
      authState.generate()
    })
  }
}

module.exports = {
  createAuthenticated
}
