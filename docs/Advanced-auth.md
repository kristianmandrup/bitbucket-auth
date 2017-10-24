# Advanced Authentication

Bitbucket uses an Access Token for authentication, using the `OAuth2` protocols

The client app needs to request the Access Token from the server, which has an expiration period.

Access tokens expire in *one hour*. When this happens you’ll get `401` responses

Most *access token grant* responses (Implicit and JWT excluded) therefore include a *refresh token* that can then be used to generate a new *access token*, without the need for end user participation

## Register an API consumer

You need to first register your client app in Bitbucket account settings, under `OAuth` configuration:

### Create/configure consumer

- Go to `https://bitbucket.org/account/user/<your account name>`
- Display your account menu (bottom left user icon).
- In the menu select `Bitbucket settings`
- Under `Access Management` select `OAuth`
- Click `Add consumer` to create a new API consumer (application)
- When the consumer is created and configured it should be granted a Key and Secret

![Bitbucket OAuth app secrets](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/OAuth2-App-secrets.png "Bitbucket OAuth app secrets")

### Consumer/app configuration

In the OAuth configuration set the callback URL and scope policies to suit your needs.
To edit an existing app configuration, use the menu to the top right (`...`)

![Bitbucket OAuth configuration](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/BitBucket-OAuth2-Settings.png "Bitbucket OAuth client app configuration")

When using Basic Auth, the `consumerKey` is the *user* and the `consumerSecret` is the *password*.

The `consumerKey` also acts as the client id (ie. `appName` or `client_id`)

## Auth0 auth

[Auth0 for bitbucket](https://auth0.com/docs/connections/social/bitbucket) is another option.

[Auth0](https://auth0.com/) works for a client app that does the authentication handshake using the browser. The app can store the JWT/access token in `localstorage`.
The token is piggy-backed on the request header on each request to the server.

## Auth Callback handler

When the end user approves permission for the app (as per browser redirect to bitbucket authorization page), bitbucket will call the configured callback (as defined on the bitbucket OAuth configuration page - see above).

A sample [express server](https://expressjs.com/) can be found in the `/server` folder which you can use to test this callback auth flow.

Simply create an app in the bitbucket OAuth config page (under account settings) and set the callback to `http://localhost:3000/authenticated`

Create a client/browser app, include this package (create a bundle via webpack, browserify or similar?).

Create an API instance as usual, then call the `authorizeOAuth2` API method to trigger the browser redirect to the bitbucket OAuth2 authentication page.

When permissions are approved, the server should trigger a callback of the uri/route (such as `http://localhost:3000/authenticated`)

## Managing (token) secrets

During development/testing, you can place your own tokens in `test/secret/access-tokens.json`, something like this (not real keys here!).

Please note that `test/secret/access-tokens.json` has been added to `.npmignore` and `.gitignore` for your safety.

```json
{
  "key": "a9d9fg2A3XrNFPjPwh9zx",
  "secret": "1djJwEd3fU4ptVut9QRPz6zjAxfUNqLA"
}
```

## Bitbucket Cloud JWT Grant (urn:bitbucket:oauth2:jwt)

If your Atlassian Connect add-on uses JWT authentication, you can swap a JWT for an OAuth access token. The resulting access token represents the account for which the add-on is installed.

Make sure you send the JWT token in the Authorization request header using the "JWT" scheme (case sensitive). Note that this custom scheme makes this different from HTTP Basic Auth (and so you cannot use `curl -u`).

Making Requests

```bash
$ curl -X POST -H "Authorization: JWT {jwt_token}" \
  https://bitbucket.org/site/oauth2/access_token \
  -d grant_type=urn:bitbucket:oauth2:jwt
```

### JWT example code

- [Bitbucket JWT code examples (Java)](https://bitbucket.org/b_c/jose4j/wiki/JWT%20Examples)

### Adding JWT to bitbucket API

The bitbucket API doesn't yet support JWT authentication. Please feel free to add JWT auth if that better suits your need.

An (experimental skeleton) implementation could start with sth. like this:

```js
apiModel.authenticateJwt = accessToken => {
  apiModel.request
    .setOption('login_type', 'jwt')
    .setOption('jwt_access_token', accessToken)
  return apiModel
}
```

To perform JWT authentication you would have to do a form `POST` request, similar to the approach used for `getTokens` in `src/auth/access-tokens.js`

It might look something like this (with `supertest` as an example)

```js
import supertest from 'supertest'
let connection = supertest('https://bitbucket.org')
try {
  let result = await connection
    .post('site/oauth2/access_token')
    .header({
      'Authorization': `JWT ${accessToken}`
    })
    .field('grant_type', 'urn:bitbucket:oauth2:jwt')
catch (err) {
  console.error(err)
}
```

May the JWT authentication gods be with you!

#### JWT Issues (for reference)

- [issue #1](https://community.atlassian.com/t5/Answers-Developer-Questions/Can-t-get-access-token-with-JWT-from-Bitbucket-API/qaq-p/533548)
- [Issue #2](https://community.atlassian.com/t5/Answers-Developer-Questions/Bitbucket-get-access-token-from-JWT/qaq-p/549041)

If you have problems, try asking on the [Atlassian community forum](https://community.atlassian.com) or on [Stack overflow](https://stackoverflow.com/questions/tagged/bitbucket)
