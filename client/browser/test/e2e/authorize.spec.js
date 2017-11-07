import test from ava
import Nightmare from './Nightmare'

// ensure clean slate before each test
let nightmare
test.beforeEach(done => {
  nightmare = new Nightmare()
})

function mock(fun, result) {
  // TODO
}

const expected = {
  token: 'abc123',
  state: 'Fds23tjt43rwqwHSG43sfERHJd643g'
}

async function simulatedAuthRedirect() {
  return await nightmare
    .goto('http://localhost:3000')
    .click('#authorize')
    // TODO: simulate 2 secs wait for redirect
    // is goto a valid redirect!?
    .goto(`http://localhost:3000?access_token=${expected.token}&state=${expected.state}`)
}

test('authorize - receives access token', async t => {
  // TODO: mock bitbucket redirect to callback uri...
  mock($.ajax, 'abc123')
  await simulatedAuthRedirect()
    .wait('#access-token')
    .evaluate(() => document.querySelector('#access-token').text)
    .end()
    // test access-token received
    .then(token => {
      t.is(token, expected.token)
      done();
    })
  // test that we retrieve, check and store state in localstorage
})

test('authorize - receives state', async t => {
  // TODO: mock bitbucket redirect to callback uri...
  mock($.ajax, 'abc123')
  await simulatedAuthRedirect()
    .wait('#state')
    .evaluate(() => document.querySelector('#state').text)
    .end()
    // test access-token received
    .then(state => {
      t.is(state, expected.state)
      done();
    })
  // test that we retrieve, check and store state in localstorage
})
