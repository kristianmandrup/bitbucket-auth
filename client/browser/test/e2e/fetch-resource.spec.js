import test from ava
import Nightmare from './Nightmare'

// ensure clean slate before each test
let nightmare
test.beforeEach(done => {
  nightmare = new Nightmare()
})

test('fecth repo resource', async t => {
  // mock ajax response with repo data

  const data = await nightmare
    .goto('http://localhost:3000')
    .click('#fetch-repo')

  const expected = {
    name: 'my-repo',
    // ...
  }

  t.deepEqual(data, expected)
})

test('fecth user resource', async t => {
  // mock ajax response with user data

  const data = await nightmare
    .goto('http://localhost:3000')
    .click('#fetch-user')
    .wait('.oauth-protected-resource')

  const expected = {
    name: 'my-user',
    // ...
  }

  t.deepEqual(data, expected)
})
