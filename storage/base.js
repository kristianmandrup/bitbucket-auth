import Loggable from './loggable'

export class BaseStorage extends Loggable {
  constructor(opts) {
    super(opts)
  }

  async loadConfig(opts = {}) {
    this.notYetImplemented('loadConfig', {
      opts
    })
  }

  async saveConfig(newConfig, opts = {}) {
    this.notYetImplemented('loadConfig', {
      config: newConfig,
      opts
    })
  }
}
