import {
  nock,
  test,
  Nightmare,
  port,
  expected
} from './_util'

import {
  mockRequest,
  callbackUrl,
  indexPage
} from './mock'

// ensure clean slate before each test
let nightmare
test.beforeEach(done => {
  nightmare = new Nightmare()
})

// const authorize = nockConfig.authorize
// const authorizeUrl = [authorize.host, authorize.route].join('/')

async function simulateAuthorize() {
  mockRequest('authorize')
  return await nightmare
    // go to index.html page
    .goto(indexPage)
    // will trigger Ajax request to bitbucket.org
    // this should be intercepted by nock to playback simulated browser response 302 (redirect)
    .click('#authorize')
  // browser should now be redirected to page where access token can be parsed from query string of URL
}

async function simulatedCallback() {
  mockRequest('callback')
  return await nightmare
    .goto(callbackUrl)
}

test('authorize - receives access token', async t => {
  await simulateAuthorize()
    .wait(500) // simulate server roundtrip
    .end()

  await simulatedCallback()
    .wait(100) // allow time for browser to parse access_token and update page
    .evaluate(() => document.querySelector('#access-token').text)
    .end()
    // test access-token received
    .then(token => {
      t.is(token, expected.authorize.token)
    })
})

test('authorize - receives state', async t => {
  await simulateAuthorize()
    .wait(500) // simulate server roundtrip
    .end()

  await simulatedCallback()
    .wait(100) // allow time for browser to parse access_token and update page
    .evaluate(() => document.querySelector('#state').text)
    .end()
    // test access-token received
    .then(state => {
      t.is(state, expected.authorize.state)
    })
})
