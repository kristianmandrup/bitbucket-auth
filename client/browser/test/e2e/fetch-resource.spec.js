import test from ava
import Nightmare from './Nightmare'

// ensure clean slate before each test
let nightmare
test.beforeEach(done => {
  nightmare = new Nightmare()
})

const repo = {
  name: 'my-repo',
  // ...
}

const user = {
  name: 'my-user',
  // ...
}

const expected = {
  repo,
  user
}

test('fecth repo resource', async t => {
  // mock ajax response with repo data
  const data = await nightmare
    .goto('http://localhost:3000')
    .click('#fetch-repo')
    .wait('#repo')
    .evaluate(() => document.querySelector('#repo').text)
    .end()
    // test repo received
    .then(repo => {
      t.deepEqual(repo, expected.repo)
    })
})

test('fecth user resource', async t => {
  // mock ajax response with user data

  const data = await nightmare
    .goto('http://localhost:3000')
    .click('#fetch-user')
    .wait('#user')
    .evaluate(() => document.querySelector('#user').text)
    .end()
    // test user received
    .then(user => {
      t.deepEqual(user, expected.user)
    })
})
