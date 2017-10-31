const {
  createFetchResource
} = require('./fetch-resource')

const {
  createAuthenticated
} = require('./authenticated')

const {
  createAuthorize
} = require('./authorize')


module.exports = {
  createFetchResource,
  createAuthenticated,
  createAuthorize
}
