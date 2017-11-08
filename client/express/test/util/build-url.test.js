import test from 'ava'

import {
  buildUrl
} from '../../util'

test('buildUrl', t => {
  const base = 'localhost:3000'
  const options = {}
  const hash = '123'

  const expectedUrl = 'localhost:3000#123'
  const url = buildUrl(base, options, hash)

  // t.is(url, expectedUrl)
  t.fail('todo - too tired!!')
})
