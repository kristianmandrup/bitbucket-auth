const secret = 'xyz'
const key = '123abc'
const appName = 'my-app'
const refresh_token = 'Wxyz873abc'
const domain = 'bitbucket.org'

const payload = {
  grant_type: 'refresh_token',
  refresh_token
}

const config = {
  refresh_token
}

const username = 'bitbucket-user'
const password = 'xxxxyyyy-secret'

function setEnvVars() {
  process.env.bitbucketKey = key
  process.env.bitbucketSecret = secret
}

// for Basic auth access
// use username/password of bitbucket user account
async function basicAuth(config = {}) {
  return config.credentials || {
    username: process.env.bitbucketKey,
    password: process.env.bitbucketSecret
  }
}

let opts = {
  valid: {
    appName,
    payload,
    config,
    consumerSecret: secret,
    consumerKey: key,
  },
  missing: {
    appName: 'my-name'
  },
  invalid: {
    appName: 'my-name',
    consumerSecret: 32
  }
}

const hostname = `https://${domain}`
const path = '/site/oauth2/access_token'
const accessToken = 'ohyeahbaby!'
const successBody = {
  access_token: accessToken
}

const {
  log
} = console

const anyPayload = () => {
  return true
}

const headers = {
  reqheaders: {
    'authorization': 'Basic Auth'
  }
}

const successResult = {
  body: successBody,
  ok: true
}

const refreshToken = refresh_token

export {
  log,
  anyPayload,
  headers,
  secret,
  refreshToken,
  key,
  appName,
  domain,
  payload,
  config,
  opts,
  hostname,
  path,
  accessToken,
  successBody,
  successResult,
  setEnvVars,
  basicAuth
}
