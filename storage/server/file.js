import {
  BaseStorage
} from '.'
import {
  promisify
} from 'util'

const homeDir = require('homeDir')
const fsx = require('fs-extra')

export function createFileStorage(opts) {
  return new FileStorage(opts)
}

export class FileStorage extends BaseStorage {
  constructor(opts) {
    super(opts)
    this.writeFile = opts.writeFile || promisify(fsx.writeJson)
    this.readFile = opts.readFile || promisify(fsx.readJson)
  }

  configPath(opts) {
    const {
      appName,
      configPath
    } = opts
    if (!appName) {
      this.handleError('Missing appName in options', {
        opts
      })
    }
    return configPath || this.homeDir(appName)
  }

  homeDir(appName) {
    return homeDir(`/.${appName}`)
  }

  get writeOpts() {
    return {
      mode: 666
    }
  }

  get readOpts() {
    return {
      mode: 666
    }
  }

  async loadConfig(opts = {}) {
    opts = opts || this.opts
    let configPath = this.configPath(opts)
    // set default path for storing config
    let config
    try {
      config = await this.readFile(configPath, this.readOpts)
    } catch (e) {
      config = {}
    }
    return config
  }

  async saveConfig(newConfig, opts = {}) {
    opts = opts || this.opts
    let configPath = this.configPath(opts)
    let {
      username
    } = opts
    let written = await this.writeFile(configPath, newConfig, this.writeOpts)
    // log a message if we're using the password flow to retrieve a token
    if (username) {
      this.log(`stored auth config in ${configPath}`, {
        username
      })
    }
  }
}
