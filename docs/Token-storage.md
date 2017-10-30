# Token storage

You can supply a `loadConfig` function that loads configuration from a storage:

- from a `.json` file
- from a database
- ...

A sample `FileStorage` class is provided in the `/auth` folder of this package.
You can pass a `storage` object with `loadConfig` and `saveConfig` methods.

```js
import { createFileStorage } from 'bitbucket-auth/storage'

const storage = createFileStorage({
  logging: true
})
const accessToken = await getAccessToken({
  appName: 'my-app',
  storage
})
```

## loadConfig

```js
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
```

If you supply a `loadConfig` function you would normally provide a `saveConfig` method as well.

## saveConfig

```js
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
```
