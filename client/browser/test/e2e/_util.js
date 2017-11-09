import test from 'ava'
import Nightmare from 'nightmare'

const repo = {
  name: 'my-repo',
  // ...
}

const user = {
  name: 'my-user',
  // ...
}

const auhtorize = {
  token: 'abc123',
  state: 'Fds23tjt43rwqwHSG43sfERHJd643g'
}

const expected = {
  repo,
  user,
  auhtorize
}

const port = '8080'

export {
  test,
  Nightmare,
  port,
  expected
}
