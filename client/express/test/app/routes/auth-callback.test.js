import {
  test,
  request,
  app
} from '../../base'

// valid server callback data
const validAuth = {
  // ...
  redirect_uri: expected.redirect_uri, // it really knows me
  state: expected.state // trusted secret
}

const invalidRedirectUriAuth = {
  // ...
  redirect_uri: 'BAD-URI', // it really knows me
  state: expected.state // trusted secret
}


// invalid server callback data
const invalidStateAuth = {
  // ...
  redirect_uri: expected.redirect_uri,
  state: 'BAD-STATE'
}

const payload = {
  valid,
  invalid: {
    badState: invalidStateAuth,
    badRedirectUri: invalidRedirectUriAuth
  }
}

function mockSuccess() {

}

async function simulateAuthCallback(payload) {
  return await request(app)
    .send(payload)
    .get('/auth-callback')
}

const error = {
  badRedirectUri: 500,
  badState: 500
}

test('Express app: responds OK to valid /auth-callback request', async t => {
  let result = await simulateAuthCallback(payload.valid)
    .expect(200)

  // t.is(result.body, {})
})

test('Express app: responds ERROR to /auth-callback request with invalid state', async t => {
  let result = await simulateAuthCallback(payload.invalid.badState)
    .expect(error.badState) // which code is it really?
  // t.is(result.body, {})
})

test('Express app: responds ERROR to /auth-callback request with invalid redirect_uri', async t => {
  let result = await simulateAuthCallback(payload.invalid.badRedirectUri)
    .expect(error.badRedirectUri) // which code is it really?
  // t.is(result.body, {})
})
