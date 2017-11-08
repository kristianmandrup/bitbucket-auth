import test from 'ava'

import {
  buildUrl
} from '../../util'

const config = {}
const opts = {
  logging: true
}

let authState
test.beforeEach(done => {
  authState = createAuthState(config, opts)
})

test.afterEach(done => {
  authState.clear()
})

test('AuthState: createAuthState - clear state', t => {
  t.is(typeof authState.state, undefined)
  t.fail('todo - too tired!!')
})

test('AuthState: generate and get - string state', t => {
  authState.generate()
  t.is(typeof authState.state, 'string')
})

test('AuthState: generate and clear - clears state', t => {
  authState.generate()
  t.is(typeof authState.state, 'string')
  authState.clear()
  t.is(typeof authState.state, 'undefined')
})
