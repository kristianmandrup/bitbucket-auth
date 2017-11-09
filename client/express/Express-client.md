# Express client

This folder contains an outline of an [Express](expressjs.com/) server (ie. a back-end client app) for [Bitbucket OAuth authentication](https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html
) which grants access to use the [Bitbucket API](https://confluence.atlassian.com/bitbucket/use-the-bitbucket-cloud-rest-apis-222724129.html).

The app is partly modelled on the generic server from the book [OAuth2 in Action](https://www.manning.com/books/oauth-2-in-action)

Please feel free to help improve this server, making it more modular, with support for more flows, grant types etc.

## TODO

See the generic solutions from the book in `client/generic` folder and adjust the express routes to match the flows found there ;)

## Routes

The `/routes` contains the following route factories

- `createAuthCallback`
- `createAuthorize`
- `createFetchResource`

Each return an express route of the form `(req, res, next)`

- `/authorize` initiate authorization via bitbucket auth server, send basic credentials
- `/auth-callback` the routed called back by bitbucket auth server on successful authorization (phase 1)
- `fetch-resource` fetch a resource on the API server using received `access_token`

Note that the `/auth-callback` route will be receiving the `access_token` from the auth server. This is to ensure that the client app and never the resource owner has access to the `access_token`. This implies that the middleman and never the end user can get the `access_token` and hence, not a malicious system or hacker either!

## Compare with generic

The "generic" callback handler (*from the OAuth2 book*) looks like this:

Compare received callback request query `state` param with local client (session) state

- Fail on state mismatch
- If state match, request an acces token

### request an acces token

- Prepare `access_token` request
- Make POST requst for `access_token`
- Process response with `access_token` and `refresh_token`

```js
app.get('/callback', function (req, res) {

  if (req.query.error) {
    // it's an error response, act accordingly
    res.render('error', {
      error: req.query.error
    });
    return;
  }

  var resState = req.query.state;
  if (resState != state) {
    console.log('State DOES NOT MATCH: expected %s got %s', state, resState);
    res.render('error', {
      error: 'State value did not match'
    });
    return;
  }

  // PREPARE getAccessToken
  var code = req.query.code;

  var form_data = qs.stringify({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: client.redirect_uris[0]
  });
  var headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + new Buffer(querystring.escape(client.client_id) + ':' + querystring.escape(client.client_secret)).toString('base64')
  };

  // REQUEST getAccessToken
  var tokRes = request('POST', authServer.tokenEndpoint, {
    body: form_data,
    headers: headers
  });

  console.log('Requesting access token for code %s', code);

  // PROCESS response with access_token
  if (tokRes.statusCode >= 200 && tokRes.statusCode < 300) {
    var body = JSON.parse(tokRes.getBody());

    access_token = body.access_token;
    console.log('Got access token: %s', access_token);
    if (body.refresh_token) {
      refresh_token = body.refresh_token;
      console.log('Got refresh token: %s', refresh_token);
    }

    scope = body.scope;
    console.log('Got scope: %s', scope);

    res.render('index', {
      access_token: access_token,
      scope: scope,
      refresh_token: refresh_token
    });
  } else {
    res.render('error', {
      error: 'Unable to fetch access token, server response: ' + tokRes.statusCode
    })
  }
});
```

### Our solution using `getAccessToken`

We first compare the received query params state with the local state via `authState` (an `AuthState` instance)

```js
if (state !== authState.state) {
  // proceed to get access and refresh tokens
} else {
  // fail
}
```

`getAccessToken` seeks to handle the full access token request:

- Prepare `access_token` request
- Make POST requst for `access_token`
- Process response with `access_token` and `refresh_token`

```js
  return function authCallback(request, response, next) {
    const {
      query
    } = request
    const {
      code,
      state
    } = query
    log('authorized by bitbucket', {
      query,
      code
    })

    if (state !== authState.state) {
      // If the state value doesn’t match what we’re expecting,
      // that’s a very good indication that something "fishy" is happening,
      // such as a session fixation attack
      res.render('error', {
        error: 'State value did not match'
      })
      return;
    }

    // Make a HTTP form encoded request and authenticate client
    // using HTTP Basic Auth
    // Can be done using getAccessToken()
    // Will use refreshToken if available in storage
    getAccessToken({
      appName: 'my-app',
      storage
    }).then(result => {
      // result contains accessToken and refreshToken
      let {
        accessToken,
        refreshToken
      } = result
      log('retrieved', result)
    }).catch(err => {
      // regenerate auth state
      log('ERROR: access_token could not be retrieved', err)
      authState.generate()
    })
  }
  ```
