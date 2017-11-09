# Access Token authentication

Bitbucket API OAuth2 token authentication and storage.

See [oauth on bitbucketcloud](https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html)

For a more detailed break down and usage guide, see the [Advanced auth](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/Advanced-auth.md) document (in `/docs`)

## Additional OAuth2 Resources

These resources will provide a much deeper understanding of all the mechanics behind the OAuth2 flow:

- Book: [OAuth2 in Action](https://www.manning.com/books/oauth-2-in-action)
- [Auth flow](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/Auth-flow.md)
- [Auth flow steps](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/Flow-steps.md)
- [Notes on protection measures](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/Extra-protection.md)

I highly recommend buying and reading the book, but these resources will (hopefully) get you started. Also check out the sample client apps (see below)

## Example

To get an access token, call `getAccessToken`

```js
import {
  getAccessToken
} from 'bitbucket-auth'

const config = {
  appName: 'my-app', // ie. client_id for registered app
  consumerKey: process.env.bitbucketKey,
  consumerSecret: process.env.bitbucketSecret,
  // ... more configuration (see function getAccessToken)
}

const accessToken = await getAccessToken(config)

// create API instance with accessToken set in header for each request
const api = createBitbucketAPI(accessToken)
```

`getAccessToken` will try to read the `consumerKey` and `consumerSecret` from the above listed environment variables if they are not passed as arguments.

If you follow this best practice (ie. storing key and secret in these specific `ENV` variables), you can simplify to:

```js
const accessToken = await getAccessToken({
  appName: 'my-app',
  loadConfig,
  saveConfig
})
```

Note that you must pass a `credentialsProvider` function which provides the user credentials for Basic Auth (ie. `username` and `password`). The credentials  consist of the `key` and `secret` for the registered bitbucket client app (ie. the app that is requesting access and must be pre-registered as a valid client app on bitbucket OAuth settings.

## How OAuth authorization works

The authorization request communicates with the bitbucket authorization server, which acts as a "middle man" between the client app and the bitbucket resource server.

The bitbucket authorization server manages and provides access to bitbucket API by granting the client an access token. The token which provides access to a limited scope of actions as defined for the particular app.

## Fine control

You can pass a `useRefreshToken(config)` function as an option to fine-control when to use the `refreshToken` instead of making a full credentials request.

By default pass a `forceCredentials: true` option to force a full credentials request.

## Logging/debugging

You can pass a custom `logger` to log/debug the internals. To enable logging/debugging,
 set the `logging: true` option (will fall back to use a default `logger`)

```js
const accessToken = await getAccessToken({
  logger: myLogger
  logging: true
})
```
## Customization of request

You can customize the way the request is sent and handled by providing your own functions as options:

- `sendRequest(opts)`
- `createRequestHandler(opts)`

You can also supply any of the following methods to further refine/customize your request flow as needed

- `isSuccess(res)`
- `isUnauthorized(res)`
- `handleError(opts)`
- `handleSuccess(opts)`

See the default implementations in `src/request.js` for customization details/ requirements.
## Token storage

To enable token storage, you need to supply `loadConfig` and `saveConfig` functions.
See [Token-storage](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/Token-storage.md) for more details and examples using a `.json` file.

```js
function loadConfig(opts = {}) {
  // ...
  return config
}

function saveConfig(config, opts = {}) {
  // ...
}
```

You an also opt to pass a `storage` object with `loadConfig` and `saveConfig` methods.

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

### Storage

A simple filestorage is made available in `/storage` for your convenience., which requires `homeDir` and `fs-extra` as (minimal) dependencies.

### Client app (server)

Sample clients such as an express app can be found in the `/client` folder. These clients can be used as inspiration and baselines to build on...

Note that the client apps are WIP and has not yet been tested.
Please help make them better!

See the [Express client](https://github.com/kristianmandrup/bitbucket-auth/blob/master/client/express/Express-client.md) document for more.

Sample code from Express client app:

```js
// handle bitbucket authorization callback by authorization server
app.get('/auth-callback', (request, response) => {
  const {
    query
  } = request
  const {
    code
  } = query
  log('authenticated', {
    query,
    code
  })

  // Make a HTTP form encoded request and authenticate client
  // using HTTP Basic Auth
  // achieved using getAccessToken()
  getAccessToken({
    appName: 'my-app',
    storage
  }).then((result) => {
    const {
      refresh_token,
      access_token,
      expires_in,
      token_type
    } = result

    // return accessToken to web app for use
    // perhaps store token in browser localstorage for typical JWT flow
  }).catch(err => {
    // accessToken likely expired
    // use refreshToken to request a fresh accessToken
  })
})
```

Full (generic) sample clients for OAuth2 can be found in `/client/generic`, from the awesome book [OAuth2 in Action](https://www.manning.com/books/oauth-2-in-action) that we recommend you buy to fully understand the OAuth2 mechanics, including each of the different grant flows.

## Bitbucket API v2

This library has been made to play nicely with [bitbucket-api-v2](https://github.com/kristianmandrup/bitbucket-api-v2)

```js
import {
  createBitbucketAPI
} from 'bitbucket-api-v2'

// create API instance with accessToken set in header for each request
const api = createBitbucketAPI({
  accessToken
})
```

### Authenticated API

`createAuthenticatedAPI` encapsulates the common authentication flow:

```js
import {
  createAuthenticatedAPI,
} from 'bitbucket-api-v2'

// create API instance with accessToken set in header for each request
const api = await createAuthenticatedAPI({
  getAccessToken,
  loadConfig,
  saveConfig,
  appName: 'my-app'
})
```

## Browser client usage

See [Bitbucket OAuth2](https://developer.atlassian.com/cloud/bitbucket/oauth-2/) guide.

You need to configure your consumer and configure a callback URL.

Once that is in place, you’ll have the following 2 URLs:

- `https://bitbucket.org/site/oauth2/authorize`
- `https://bitbucket.org/site/oauth2/access_token`

For obtaining access/bearer tokens, all four of [RFC-6749](http://www.rfc-base.org/rfc-6749.html) grant flows are supported, plus a custom Bitbucket flow for exchanging JWT tokens for access tokens.

You first need to register your client app as an OAuth client on Bitbucket to get a client id.

From your client (browser) app, request authorization from the end user by sending their browser to:

`https://bitbucket.org/site/oauth2/authorize?client_id={client_id}&response_type=code`

On successful authentication, the bitbucket server will call your callback route (as preconfigured during client app registration)

The callback includes the `?code={}` query parameter that you can swap for an access token.

You can then use this access token as an authentication `Bearer` token for subsequent requests.

You can find a sample `BitbucketClient` class under the `/client/browser` folder.

See the [Browser client](https://github.com/kristianmandrup/bitbucket-auth/blob/master/client/browserBrowser-client.md) document for more details. It uses localstorage to maintain the `state` (ie. "session secret").

Sample Bitbucket in-browser client setup:

```js
var client = {
  // client id (key) from bitbucket OAuth setings
  'client_id': 'my-oauth-client',
  // your own server callback (which bitbucket will call on successfull authorization)
  'redirect_uri': 'http://localhost:9000/my-oauth-client/callback',
  // use real scopes from bitbucket OAuth setings (if available)
  'scope': 'foo bar'
};
class MyBitBucketClient extends BitBucketClient {
  handleFetchResourceClick() {
    // custom fun
  }

  init() {
    // initialize
    return this
  }
}

function createBitbucketClient(opts = {}) {
  opts = Object.assign(opts, {
    $ // assuming jQuery is loaded, use by default
  })
  return new MyBitBucketClient(opts).init()
}

const bitBucketClient = createBitbucketClient({
  client
})

// authorize via redirect to bitbucket authorize page
bitBucketClient
  .authorize()

// later
bitBucketClient.fetchResource({
  resourceUrl,
  method
})
```

## Testing

Test are written and run using [ava](https://github.com/avajs/ava)

`$ npm test`

You can reuse the test infrastruture in `_common.js` and `_mock.js` in your own projects:

```js
import {
  mock,
  setEnvVars,
  basicAuth
} from 'bitbucket-auth/test'

// import pre-defined option sets for testing
import {
  opts
} from 'bitbucket-auth/test/_common'
```

Sample bitbucket auth test case in your own project:

```js
test('send request', async t => {
  try {
    mock()
    setEnvVars()

    let result = await sendRequest(opts.valid)
    t.truthy(result)
    t.is(result, accessToken)
  } catch (err) {
    log(err)
  }
})
```

## Packaging

To build a bundle (ie. for `dev` and `prod`):

`$ npm run build`

Specific environment bundle:

`$ npm run build:dev` or `$ npm run build:prod`

exports the library as a global var `bitbucketAuth`

```js
bitbucketAuth.getAccessToken(config)
```

## Contributors

Original version was written by [@tpettersen](https://www.npmjs.com/package/bitbucket-auth-token)

## License

MIT
