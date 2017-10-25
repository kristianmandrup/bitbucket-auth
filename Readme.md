# Access Token authentication

Bitbucket API OAuth2 token authentication and storage.

See [Advanced-auth](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/Advanced-auth.md) for more info on bitbucket API authentication.

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

If you follow this best practice (ie. storing key and secret in these specific ENV variables), you can simplify to:

```js
const accessToken = await getAccessToken({
  appName: 'my-app',
  loadConfig,
  saveConfig
})
```

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
