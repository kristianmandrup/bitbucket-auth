import test from 'ava'
import nock from 'nock'

import {
  sendRequest,
  createRequestHandler
} from '../src/request'


const secret = 'xyz'
const key = '123abc'
const appName = 'my-app'
const refresh_token = 'Wxyz873abc'
const domain = 'bitbucket.org'

const payload = {
  grant_type: 'refresh_token',
  refresh_token
}

const config = {
  refresh_token
}

let opts = {
  valid: {
    appName,
    payload,
    config,
    consumerSecret: secret,
    consumerKey: key,
  }
}

const hostname = `https://${domain}`
const path = '/site/oauth2/access_token'
const accessToken = 'ohyeahbaby!'
const successBody = {
  access_token: accessToken
}

const {
  log
} = console

const anyPayload = () => {
  return true
}

const fakePayload = anyPayload // '*'
const headers = {
  reqheaders: {
    'authorization': 'Basic Auth'
  }
}

const matchingPath = new RegExp(path)

test('sendRequest', async t => {
  // mock post request/response with access code in result body
  try {
    nock(hostname,
        // headers
      )
      .post(matchingPath, fakePayload)
      .basicAuth({
        user: key,
        pass: secret
      })
      .reply(200, successBody)

    let result = await sendRequest(opts.valid)
    t.truthy(result)
    t.is(result, accessToken)
  } catch (err) {
    log(err)
  }
})

const successResult = {
  body: successBody,
  ok: true
}

test('createRequestHandler', async t => {
  let promised = function (err, result) {
    return new Promise(function (resolve, reject) {
      let handlerOpts = Object.assign(opts.valid, {
        reject,
        resolve
      })
      let requestHandler = createRequestHandler(handlerOpts)
      requestHandler(err, result)
    })
  }

  try {
    let result = await promised(null, successResult)
    t.truthy(result)
    t.is(result, accessToken)
  } catch (err) {
    log('ERROR', err)
  }
})
