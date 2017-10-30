const express = require('express')
const app = express()
const port = 3000

const {
  createStorage
} = require('./storage')
const {
  createAuthState,
  // AuthState, // to create subclass and create custom State handler if necessary
  buildUrl
} = require('./util')

const {
  log,
  error
} = console

const hosts = {
  server: 'api.bitbucket.com',
  client: 'localhost:${port}'
}

// Bitbucket authorization server
var authServer = {
  authorizationUrl: `http://${hosts.server}/authorize`,
};

// client app information
var client = {
  client_id: process.env.bitbucketKey,
  client_secret: process.env.bitbucketSecret,
  redirect_uri: `http://${hosts.client}/authenticated`
};

// Web browser app should redirect to this client app route to start flow
// Authorizes app via Bitbucket Authorization server
app.get('/authorize', function (req, res) {
  var authorizeUrl = buildUrl(authServer.authorizationUrl, {
    response_type: 'code',
    client_id: client.client_id,
    redirect_uri: client.redirect_uri
  });

  // start the OAuth2 flow
  res.redirect(authorizeUrl);
});

// right after old accessToken is thrown out
// we should generate a new state for when we start a new flow to ask for an access token
const authState = createAuthState()

// FIX: perhaps not the best way to have it simply as a "global" var!?
let accessToken

// handle bitbucket authorization callback by authorization server
app.get('/authenticated', (request, response) => {
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
})

// Testing fetching of actual resource via bitbucket API
app.get('/fetch_resource', function (req, res) {
  if (!accessToken) {
    res.render('error', {
      error: 'Missing access token.'
    });
    return;
  }

  // TODO: fetch resource using accessToken
})

app.listen(port, err => {
  if (err) {
    return error('something bad happened', err)
  }
  log(`server is listening on ${port}`)
})
