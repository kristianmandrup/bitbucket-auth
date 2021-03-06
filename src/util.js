const {
  required,
  stringProps
} = require('./properties')

const defaults = {
  domain: 'bitbucket.org',
  errorHandler(method, opts = {}) {
    return function (msg, value) {
      if (opts.logging) {
        console.error(msg, value)
      }
      throw new Error(msg)
    }
  },
  logger(method, opts = {}) {
    return function (...msgs) {
      if (opts.logging) {
        console.log(...msgs)
      }
    }
  }
}

let errorHandler = defaults.errorHandler

function setErrorHandler(method, opts = {}) {
  return (opts.errorHandler || defaults.errorHandler)(method, opts)
}

function missing(method, name) {
  errorHandler(`${method}: missing ${name}`)
}

const secretKeys = [
  'consumerKey',
  'consumerSecret'
]

function populateDefaults(opts = {}) {
  opts.consumerKey = opts.consumerKey || process.env.bitbucketKey
  opts.consumerSecret = opts.consumerSecret || process.env.bitbucketSecret

  secretKeys.map(key => {
    if (!opts[key]) missing('populateDefaults', key)
  })
  return opts
}

function typeError(name, type, actualType) {
  errorHandler(`${method}: ${name} must be of type ${type}, was: ${actualType}`)
}

function createValidator(method) {
  return function validateOpts(opts) {
    required.map(name => {
      if (!opts[name]) missing(method, name)
    })

    stringProps.map(name => {
      let value = opts[name]
      if (!value) return
      let type = typeof value
      if (type !== 'string') typeError(method, name, 'string', type)
    })
    return true
  }
}

module.exports = {
  errorHandler,
  setErrorHandler,
  typeError,
  createValidator,
  defaults,
  populateDefaults
}
