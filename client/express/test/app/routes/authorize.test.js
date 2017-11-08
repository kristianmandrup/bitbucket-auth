import {
  test,
  request,
  app
} from '../../base'

const valid = {
  // ...
  redirect_uri: 'localhost:3000/auth-callback',
  state: 'xyz123'
}

const missingState = {
  // ...
  redirect_uri: 'localhost:3000/auth-callback',
}

const missingRedirectUri = {
  state: 'xyz123'
}

const payload = {
  valid,
  invalid: {
    missingState,
    missingRedirectUri
  }
}

const error = {
  missingRedirectUri: 500,
  missingState: 500
}

async function authorize() {
  return await request(app)
    .get('/authorize')
}

test('Express app: responds ERROR to invalid /authorize request with missing state', async t => {
  let result = await authorize()
    .send(payload.invalid.missingState)
    .expect(error.missingState)

  t.is(result.body, 'hello world')
})

test('Express app: responds ERROR to invalid /authorize request with redirect_uri', async t => {
  let result = await authorize()
    .send(payload.invalid.missingRedirectUri)
    .expect(error.missingRedirectUri)

  t.is(result.body, 'hello world')
})

test('Express app: responds OK to valid /authorize request', async t => {
  let result = authorize()
    .send(payload.valid)
    .expect(200)

  t.is(result.body, 'hello world')
})
