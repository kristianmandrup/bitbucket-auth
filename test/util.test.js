import test from 'ava'

import {
  populateDefaults,
  createValidator
} from '../src/util'

const secret = 'xyz'
const key = '123abc'

let opts = {
  valid: {
    appName: 'my-name',
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

const {
  log
} = console

test('populateDefaults: missing secrets', t => {
  t.throws(x => populateDefaults(opts.missing))
})

test('populateDefaults: env vars', t => {
  // single ENV var set not enough
  process.env.bitbucketKey = 'xyz'
  t.throws(x => populateDefaults(opts.missing))

  // both ENV vars set
  process.env.bitbucketSecret = '123abc'
  t.notThrows(x => populateDefaults(opts.missing))
  let newOpts = populateDefaults(opts.missing)
  t.truthy(typeof newOpts === 'object')
  t.truthy(newOpts.consumerKey)
  t.truthy(newOpts.consumerSecret)
})

test('createValidator', t => {
  const validate = createValidator('getAccessToken')
  t.truthy(validate(opts.valid))
  t.throws(x => validate(opts.invalid))
})
