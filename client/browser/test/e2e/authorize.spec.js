import test from ava
import Nightmare from './Nightmare'

// ensure clean slate before each test
let nightmare
test.beforeEach(done => {
  nightmare = new Nightmare()
})

test('authorize', async t => {
  // TODO: mock bitbucket redirect to callback uri...

  await nightmare
    .goto('http://localhost:3000')
    .click('#authorize')

  // test that we retrieve, check and store state in localstorage
})
