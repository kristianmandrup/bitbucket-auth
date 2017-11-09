import {
  nock,
  test,
  Nightmare,
  port,
  expected
} from './_util'

// ensure clean slate before each test
let nightmare
test.beforeEach(done => {
  nightmare = new Nightmare()
})

// defaults: same as callbackUrl
// Equivalent to: http://localhost:3000/auth-callback?access_token=${expected.token}&state=${expected.state}
const client = {
  host: 'http://localhost:3000',
  route: '/auth-callback',
  query: {
    access_token: expected.token,
    state: expected.state
  }
}

function mockRequest(opts = {}) {
  nock(opts.host || client.host)
    .get(opts.route || client.route)
    .query(opts.query || client.query)
}

async function simulatedAuthorize() {
  return await nightmare
    .goto(`http://localhost:${port}`)
    .click('#authorize')
}

const callbackUrl = `http://localhost:3000/auth-callback?access_token=${expected.token}&state=${expected.state}`

async function simulatedCallback() {
  return await nightmare
    .goto(callbackUrl)
}

test('authorize - receives access token', async t => {
  // TODO: mock bitbucket redirect to callback uri... ??
  await simulatedAuthorize()
    .wait(1000)
    .evaluate(() => document.querySelector('#access-token').text)
    .end()
    // test access-token received
    .then(token => {
      t.is(token, expected.authorize.token)
      done();
    })
  // test that we retrieve, check and store state in localstorage
})

test('authorize - receives state', async t => {
  // TODO: mock bitbucket redirect to callback uri... ??
  await simulatedAuthRedirect()
    .wait(1000)
    .evaluate(() => document.querySelector('#state').text)
    .end()
    // test access-token received
    .then(state => {
      t.is(state, expected.authorize.state)
      done();
    })
  // test that we retrieve, check and store state in localstorage
})
