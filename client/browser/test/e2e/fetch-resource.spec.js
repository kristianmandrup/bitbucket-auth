import {
  nock,
  test,
  Nightmare,
  port,
  expected
} from './_util'

import {
  mockRequest,
  indexPage
} from './mock'

// ensure clean slate before each test
let nightmare
test.beforeEach(done => {
  nightmare = new Nightmare()
})

test('fecth repo resource', async t => {
  // mock ajax response with repo data
  mockRequest('fetchRepo')

  const data = await nightmare
    .goto(indexPage)
    .click('#fetch-repo')
    .wait(500) // simulate server roundtrip
    .evaluate(() => document.querySelector('#repo').text)
    .end()
    // test repo received
    .then(repo => {
      t.deepEqual(repo, expected.repo)
    })
})

test('fecth user resource', async t => {
  // mock ajax response with user data
  mockRequest('fetchUser')

  const data = await nightmare
    .goto(indexPage)
    .click('#fetch-user')
    .wait(500) // simulate server roundtrip
    .evaluate(() => document.querySelector('#user').text)
    .end()
    // test user received
    .then(user => {
      t.deepEqual(user, expected.user)
    })
})
