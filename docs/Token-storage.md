# Token storage

You can supply a `loadConfig` function that loads configuration as you see fit, such as from `localstorage` (in browser client) or from a `.json` file on the server.

```js
const homeDir = require('home-dir')
const jsonfile = require('jsonfile')

loadConfig(opts) {
  // set default path for storing config
  const configPath = homeDir('/.' + opts.appName)
  let config
  try {
    config = jsonfile.readFileSync(configPath)
  } catch (e) {
    config = {}
  }
  return config
}
```

If you supply a `loadConfig` function you would normally provide a `saveConfig` method as well.

```js
saveConfig(newConfig, opts = {}) {
  const { configPath, username, logger } = opts
  jsonfile.writeFile(configPath, newConfig, {
    mode: 600
  }, function () {
    // log a message if we're using the password flow to retrieve a token
    if (username) {
      logger('storing auth token in ' + configPath)
    }
  })
}
```
