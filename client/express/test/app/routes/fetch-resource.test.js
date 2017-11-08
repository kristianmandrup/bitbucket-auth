import {
  test,
  request,
  app
} from '../../base'

test('Express app responds to /resource request', async t => {
  let result = await request(app)
    .get('/resource')
    .expect(200)

  // t.is(result.body, {})
})
