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

test('getAccessToken: credentialsProvider', async t => {
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

const username = key
const password = secret

const credentials = {
  username,
  password
}

const consumerKey = key
const consumerSecret = secret


test('getTokens: username and password', async t => {
  try {
    setEnvVars()
    mock()
    let token = await getTokens({
      username,
      password,
      consumerKey: process.env.bitbucketKey,
      consumerSecret: process.env.bitbucketSecret,
      logging: true
    })
    t.truthy(token)
    t.pass('should work with username and password')
  } catch (err) {
    log(err)
    t.fail('should not fail with username and password')
  }
})

test('getTokens: refreshToken', async t => {
  try {
    setEnvVars()
    mock()
    let token = await getTokens({
      refreshToken,
      consumerKey: process.env.bitbucketKey,
      consumerSecret: process.env.bitbucketSecret,
      logging: true
    })
    t.truthy(token)
    t.pass('should work with refreshToken')
  } catch (err) {
    log(err)
    t.fail('should not fail with refreshToken')
  }
})

test('getTokens: no credentials', async t => {
  try {
    setEnvVars()
    mock()

    await getTokens({})
    t.fail('should not work without proper credentials')
  } catch (err) {
    t.pass('fails as expected without any credentials')
  }
})
