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
  getTokens,
  useRefreshToken
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

test('useRefreshToken: with refresh token', t => {
  const config = {
    refreshToken
  }
  t.truthy(useRefreshToken(config))
})

test('useRefreshToken: with refresh token but forceCredentials: true', t => {
  const config = {
    refreshToken,
    forceCredentials: true
  }
  t.falsy(useRefreshToken(config))
})


test('getAccessToken: refresh token', async t => {
  try {
    setEnvVars()
    mock()
    let token = await getAccessToken({
      appName: 'my-app',
      refreshToken
    })
    // log('received token:', {
    //   token
    // })
    t.truthy(token)
  } catch (err) {
    t.fail(err.message)
  }
})

async function credentialsProvider() {
  return {
    refreshToken
  }
}

test('getTokens: credentialsProvider', async t => {
  try {
    setEnvVars()
    mock()
    let token = await getAccessToken({
      appName: 'my-app',
      credentialsProvider
    })
    // log('received token:', {
    //   token
    // })
    t.truthy(token)
  } catch (err) {
    t.fail(err.message)
  }
})
