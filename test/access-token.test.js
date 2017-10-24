import test from 'ava'
import {
  mock
} from './_mock'

import {
  log,
  key,
  secret,
  refreshToken,
  setEnvVars
} from './_common'

import {
  getAccessToken,
  getTokens
} from '../src/access-token'

test('getAccessToken: no credentials', async t => {
  try {
    setEnvVars()
    mock()
    let token = await getAccessToken({
      appName: 'my-app'
    })
    t.truthy(token)
  } catch (err) {
    t.pass(err.message)
  }
})

test('getAccessToken: refresh token', async t => {
  try {
    setEnvVars()
    mock()
    let token = await getAccessToken({
      appName: 'my-app',
      refreshToken
    })
    t.truthy(token)
  } catch (err) {
    t.fail(err.message)
  }
})


test('getTokens: credentialsProvider', async t => {
  t.fail('todo')
  // let token = await getTokens()
  // t.truthy(token)
})
