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
