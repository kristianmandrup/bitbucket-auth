import test from 'ava'

let storage
test.beforeEach(done => {
  storage = createStorage()
})

test.afterEach(done => {
  // storage.clear()
})

test('storage: save and retrieve', t => {
  let x = storage.getItem('x')
  t.is(x, undefined)

  storage.setItem('x', 42)
  let x = storage.getItem('x')
  t.is(x, 42)
})
