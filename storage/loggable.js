module.exports = class Loggable {
  constructor(opts = {}) {
    this.className = this.constructor.name
    this.opts = opts
  }

  log(...msgs) {
    if (this.logging) {
      console.log(`${this.className}:`, ...msgs)
    }
  }

  error(...msgs) {
    if (this.logging) {
      return this.log('ERROR', ...msgs)
    }
  }

  handleError(err, data) {
    this.error(err, data)
    throw err
  }
}
