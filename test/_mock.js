import nock from 'nock'

import {
  anyPayload,
  secret,
  key,
  appName,
  refresh_token,
  domain,
  payload,
  config,
  opts,
  hostname,
  path,
  accessToken,
  successBody
} from './_common'

const fakePayload = anyPayload // '*'
const matchingPath = new RegExp(path)

export function mock() {
  nock(hostname,
      // headers
    )
    .post(matchingPath, fakePayload)
    .basicAuth({
      user: key,
      pass: secret
    })
    .reply(200, successBody)
}
