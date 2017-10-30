const express = require('express')
const app = express()
const {
  log,
  error
} = console
const {
  port,
  hosts
} = require('./constants')
const {
  createStorage
} = require('./storage')
const {
  createAuthState,
  // AuthState, // to create subclass and create custom State handler if necessary
} = require('./util')

// right after old accessToken is thrown out
// we should generate a new state for when we start a new flow to ask for an access token
const authState = createAuthState()
// FIX: perhaps not the best way to have it simply as a "global" var!?
let accessToken

const config = {
  authState,
  accessToken
}

const {
  createFetchResource,
  createAuthenticated,
  createAuthorize
} = require('./routes')

const routes = {
  authorize: createAuthorize(config),
  authenticated: createAuthenticated(config),
  fetchResource: createFetchResource(config)
}

// TODO: use proper router/router middleware...

// Web browser app should redirect to this client app route to start flow
// Authorizes app via Bitbucket Authorization server
app.get('/authorize', routes.authorize);

// handle bitbucket authorization callback by authorization server
app.get('/authenticated', routes.authenticated)

// Testing fetching of actual resource via bitbucket API
app.get('/resource', routes.fetchResource)

app.listen(port, err => {
  if (err) {
    return error('something bad happened', err)
  }
  log(`server is listening on ${port}`)
})
