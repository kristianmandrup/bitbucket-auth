const {
  log,
  error
} = console

const url = require('url');
const __ = require('underscore');
const randomstring = require('randomstring')

function buildUrl(base, options, hash) {
  var newUrl = url.parse(base, true);
  delete newUrl.search;
  if (!newUrl.query) {
    newUrl.query = {};
  }
  __.each(options, (value, key, list) => {
    newUrl.query[key] = value;
  });
  if (hash) {
    newUrl.hash = hash;
  }
  return url.format(newUrl);
}

function defaultStateGenerator() {
  return randomstring.generate()
}

function createAuthState(config, opts) {
  return new AuthState(config, opts)
}

class AuthState {
  constructor(config = {}, opts = {}) {
    this.generator = config.generator || defaultStateGenerator
    this.generate()
  }

  generate() {
    this.authState = this.generator()
    return this
  }

  clear() {
    this.authState = undefined
  }

  get state() {
    return this.authState
  }
}

module.exports = {
  buildUrl,
  createAuthState,
  AuthState
}
