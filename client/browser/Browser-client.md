# Bitbucket browser client app

This folder will contain a full in-browser client app that can authenticate with Bitbucket authorization server via OAuth2 using the implicit grant type flow.

The client will be modelled on the generic browser client app, available under `/client/generic/browser` in this project.

## Status

The generic sample has then been converted into a class `BitbucketClient` in `src/bitbucket`. We then use webpack with babel to compile it to ES5 in `/dist` to:

- `bitbucket-client.js`
- `bitbucket-client.prod.js`

## Use the dist

You can use the pre-compiled bitbucket client distributions in your client app project:

- `bitbucket-auth/client/browser/dist/bitbucket-client.js`
- `bitbucket-auth/client/browser/dist/bitbucket-client.prod.js`

## API usage

Client instantiation example

```js
var client = {
  // client id (key) from bitbucket OAuth setings
  'client_id': 'oauth-client-1',
  // your own server callback (which bitbucket will call on successfull authorization)
  'redirect_uris': ['http://localhost:9000/callback'],
  // use real scopes from bitbucket OAuth setings (if available)
  'scope': 'foo bar'
};
const authorizationEndpoint = 'http://localhost:3000/auth-server/authorize'

const $ = jQuery
const ajax = $.ajax // or whatever you want to use to make XHR/Ajax requests
const bitBucketClient = new BitBucketClient({
  client,
  $,
  ajax,
  authorizationEndpoint
})
```

You will likely want to subclass `BitBucketClient` to provide your own specialized functionality.

A good function to override is `makeAjaxRequest(requestObj)` which make the Ajax requests and reacts to success/failure of the request.

```js
const server = {
  authorizeEndpoint: 'http://localhost:9000/my-auth-server/ouath2/authorize'
}

const client = {
  // client id (key) from bitbucket OAuth setings
  client_id: 'oauth-client-1',
  // your redirect uris which will be called on successfull authorization
  // also supports multiple uris in redirect_uris:
  redirect_uri: 'http://localhost:9000/callback',
  // use real scopes from bitbucket OAuth setings (if available)
  scope: 'foo bar'
};
class MyBitBucketClient extends BitBucketClient {
  constructor(opts = {}) {
    super(opts)
    this.authorizationEndpoint = server.authorizeEndpoint
  }
  makeAjaxRequest(requestObj) {
    // custom fun to make request and call onSuccess or onFailure
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
  client,
  logging: true // enable detailed logging
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

Please note that the `BitBucketClient` is still untested and ripe for improvement, with more fine grained functions/handlers etc. to make it easier to customize as needed.

## API overview

### Main API

- `authorize()` perform authorization on configured `authorizationEndpoint`
- `actOnResource(opts)` act on a given resource (resource API call)
- `makeAjaxRequest(requestObj)` - make an Ajax request to authorize or act on a resource
- `buildRequestObj(data)` build a request object used for Ajax request
- `processCallback()` - process `location.hash` from callback, extract `state` and `access_token`

### Event handlers

- `onAjaxFailure(opts)` handle failed Ajax request
- `onAjaxSuccess(opts)` handle succesful Ajax request
- `onStateMatch(callbackData)` handle when state received matches generated state
- `onStateMismatch()` handle state mismatch error

### Utility methods

- `validateClientConfig(client)` validate client configuration object to be used
- `generateState(length)` generate random state to act as session security (secret)

## SampleBitBucketClient

A `SampleBitBucketClient` example is included for reference under `test/app`.
This client should be suitable for the `index.html` app that can be found there.

We will test it via [Nightmare](https://github.com/segmentio/nightmare#api) headless browser E2E testing. We will mock bitbucket responses.

The `init` method configures the HTML DOM elements with onClick handlers (assuming jQuery is loaded and available as `$`)

- `oauth-authorize` click triggers `handleAuthorizationRequestClick`
- `oauth-fetch-resource` click trigger `handleFetchResourceClick`

In this example, you can simply set `data-resource="repos/username/reponame" data-method="post"` to point to the bitbucket API endpoint and `method` to the HTTP method you want to use to interact with that endpoint (default: `post`).

```html
<button class="btn btn-default oauth-authorize" type="button">Get OAuth Token</button>
<button class="btn btn-default oauth-fetch-resource" data-resource="repos/username/reponame" type="button">Get Protected Resource</button>
```

See `sample.html` for a simple sample app using sample.

Note: You will likely need to add `sample.js` as an additional webpack entry/output or similar so that you can load it in the html page as: `<script src="dist/sample-client.js"></script>`.

You can extend and customize this sample as you see fit.

### Testing

See [UI testing with Nightmare](https://segment.com/blog/ui-testing-with-nightmare/)

We use [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html) to build the code under test and serve it on a static file server.

See [Webpack with Webpack Dev Server Configuration](https://www.youtube.com/watch?v=soI7X-7OSb4)

We use [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) to generate the html page to be served. For more details see [this post](https://javascriptplayground.com/blog/2016/07/webpack-html-plugin/)

We also have [webpack dashboard](https://medium.com/@wesharehoodies/webpack-dashboard-with-create-react-app-vue-cli-and-custom-configs-49166e1a69de) available.

Go to `localhost:8080/` to launch your app or use the `hot` reload webpack configuration in place (will watch files and re-fresh browser on any change)

The `webpack/webpack.common.js` contains the configuration for launching a web page with the bundled js. Note that we reference a template for the `html` file, ie. `templatePath`

```js
const rootPath = path.resolve(__dirname, '../')
const distPath = path.resolve(__dirname, '../dist')
const assetsPath = path.resolve(__dirname, '../assets')
const indexPath = path.resolve(__dirname, '../src/index.js')
const templatePath = path.resolve(__dirname, '../templates/sample.html')

module.exports = {
  // ...
  devServer: {
    contentBase: distPath,
    hot: true,
    // compress: true,
    // filename: 'bundle.js',
    // watchOptions: {
    //   aggregateTimeout: 300,
    //   poll: 1000
    // },
    // It's a required option.
    // where to load extra assets from (root for the page)
    publicPath: assetsPath,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Sample Bitbucket Auth app',
      // Load a custom template (lodash by default see the FAQ for details)
      template: templatePath,
    })
  ],
  // ...
}
```
