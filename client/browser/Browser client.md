# Bitbucket browser client app

This folder will contain a full in-browser client app that can authenticate with Bitbucket authorization server via OAuth2 using the implicit grant type flow.

The client will be modelled on the generic browser client app, available under `/client/generic/browser` in this project.

## Status

For now we have simply copied over the generic client as `src/generic`.

The generic sample has then been converted into a class `BitbucketClient` in `src/bitbucket`. We then use webpack with babel to compile it to ES5 in `/dist` to:

- `bitbucket-client.js`
- `bitbucket-client.prod.js`

## Use the dist

You can use the pre-compiled bitbucket client distributions in your client app project:

- `bitbucket-auth/client/browser/dist/bitbucket-client.js`
- `bitbucket-auth/client/browser/dist/bitbucket-client.prod.js`

```js
var client = {
  // client id (key) from bitbucket OAuth setings
  'client_id': 'oauth-client-1',
  // your own server callback (which bitbucket will call on successfull authorization)
  'redirect_uris': ['http://localhost:9000/callback'],
  // use real scopes from bitbucket OAuth setings (if available)
  'scope': 'foo bar'
};
const $ = jQuery
const ajax = $.ajax // or whatever you want to use to make XHR/Ajax requests
const bitBucketClient = new BitBucketClient({
  client,
  $,
  ajax
})
bitBucketClient.execute()
```

You will likely want to subclass `BitBucketClient` and provide your own specialized functionality...

A good function to override is `handleFetchResourceClick` which make the Ajax requests and reacts to success/failure of result.

```js
class MyBitBucketClient extends BitBucketClient {
  handleFetchResourceClick() {
    // custom fun
  }
}

const bitBucketClient = new BitBucketClient({
```

Please note that the `BitBucketClient` is still untested and ripe for improvement, with more fine grained functions/handlers etc. to make it easier to customize as needed.

## SampleBitBucketClient

A `SampleBitBucketClient` example is included for reference. It should more or less be suitable for the `index.html` that can be found here.

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
