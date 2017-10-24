import test from 'ava'

import {
  sendRequest,
  createRequestHandler
} from '../src/request'

import {
  log,
  config,
  opts,
  accessToken,
  successResult
} from './_common'

import {
  mock
} from './_mock'

test('sendRequest', async t => {
  // mock post request/response with access code in result body
  try {
    mock()
    let result = await sendRequest(opts.valid)
    t.truthy(result)
    t.is(result, accessToken)
  } catch (err) {
    log(err)
  }
})

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
