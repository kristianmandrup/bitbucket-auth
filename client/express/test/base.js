import test from 'ava'
import request from 'supertest'

import {
  startApp
} from '../src'

let app
test.beforeEach(done => {
  app = startApp()
})

test.afterEach(done => {
  app.close()
})

export {
  test,
  request,
  app
}
