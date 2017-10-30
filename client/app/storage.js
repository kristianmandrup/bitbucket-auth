const {
  createFileStorage
} = require('bitbucket-auth/storage')

const defaultOpts = {
  logging: true
}

function createStorage(opts) {
  return createFileStorage(opts || defaultOpts)
}

module.exports = {
  createStorage
}
