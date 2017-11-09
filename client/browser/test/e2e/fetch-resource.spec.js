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

test('fecth repo resource', async t => {
  // mock ajax response with repo data
  const data = await nightmare
    .goto(`http://localhost:${port}`)
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
    .goto(`http://localhost:${port}`)
    .click('#fetch-user')
    .wait('#user')
    .evaluate(() => document.querySelector('#user').text)
    .end()
    // test user received
    .then(user => {
      t.deepEqual(user, expected.user)
    })
})
