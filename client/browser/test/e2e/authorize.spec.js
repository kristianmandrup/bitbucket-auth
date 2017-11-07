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

test('authorize', async t => {
  // TODO: mock bitbucket redirect to callback uri...
  mock($.ajax, 'abc123')

  const expected = {
    token: 'abc123'
  }

  await nightmare
    .goto('http://localhost:3000')
    .click('#authorize')
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
