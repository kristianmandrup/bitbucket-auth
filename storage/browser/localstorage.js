import {
  BaseStorage
} from '.'

export class LocalStorage extends BaseStorage {
  constructor(opts) {
    super(opts)
    this.storage = opts.storage || localStorage
    this.storageKey = opts.storageKey || this.defaultStorageKey || 'bitbucket-auth-config'
  }

  get defaultStorageKey() {
    'bitbucket-auth-config'
  }

  async loadConfig(opts = {}) {
    return this.storage.get(this.storageKey)
  }

  async saveConfig(newConfig, opts = {}) {
    this.storage.set(this.storageKey, newConfig)

  }
}
