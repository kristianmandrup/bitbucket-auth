import {
  test,
  request,
  app
} from '../base'

// TODO: should pass?
test('Express app responds to / request', async t => {
  let result = await request(app)
    .get('/')
    .expect(200)

  // t.is(result.body, {})
})

test('Express app responds to /authorize request', async t => {
  let result = await request(app)
    .get('/authorize')
    .expect(200)

  t.is(result.body, 'hello world')
})

test('Express app responds to /auth-callback request', async t => {
  let result = await request(app)
    .get('/auth-callback')
    .expect(200)

  // t.is(result.body, {})
})

test('Express app responds to /resource request', async t => {
  let result = await request(app)
    .get('/resource')
    .expect(200)

  // t.is(result.body, {})
})
