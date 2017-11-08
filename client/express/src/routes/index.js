const {
  createFetchResource
} = require('./fetch-resource')

const {
  createAuthCallback
} = require('./auth-callback')

const {
  createAuthorize
} = require('./authorize')


module.exports = {
  createFetchResource,
  createAuthCallback,
  createAuthorize
}
