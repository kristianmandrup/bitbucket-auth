# OAuth 2: Flow steps

The following steps illustrate the multi step OAuth 2 flow and interactions between all the players, in order to:

- authenticate
- authorize
- issue and provide an access token to access the protected resource

## Step 1: Client app redirects resource owner to Authorization server

When the client realizes that it needs to get a new OAuth access token, it sends the resource owner to the authorization server with a request that indicates that the client is asking to be delegated some piece of authority by that resource owner.

The web client makes a HTTP redirect to the authorization server’s authorization endpoint.

This redirect to the browser causes the browser to send an HTTP `GET` to the authorization server.

![Client app redirects resource owner to Authorization server](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/images/oauth2-flow/steps/1-client-owner-redirect.png "Client app redirects resource to Authorization server")

```bash
GET /authorize?response_type=code&scope=foo&client_id=oauth-client -1&redirect_uri=http%3A%2F%2Flocalhost%3A3000% 2Fauthenticated&state=Lwt50DDQKUB8U7jtfLQCVGDL9cnmwHH1 HTTP/1.1
Host: api.bitbucket.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:39.0)
Gecko/20100101 Firefox/39.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Referer: http://localhost:3000/
Connection: keep-alive
```

The client identifies itself and requests particular items such as scopes by including query parameters in the URL.

## Step 2: Resource owner authenticates on Authorization server

The authorization server stores the authorization decision for future use (known as `FOSU`). Future requests for the same access by the same client won’t prompt the user interactively.

The user will still be redirected to the authorization endpoint, and will still need to be logged in, but the decision to delegate authority to the client will have already been made during a previous attempt.

The authorization server redirects the user back to the client application
This takes the form of an HTTP redirect to the client’s `redirect_uri`.

```bash
HTTP 302 Found
Location: http://localhost:3000/oauth_callback?code=8V1pr0rJ&state=Lwt50DDQKU B8U7jtfLQCVGDL9cnmwHH1
```

![Resource owner authenticates on Authorization server](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/images/oauth2-flow/steps/2-owner-authenticate.png "Resource owner authenticates on Authorization server")

This in turn causes the browser to issue the following request back to the client:

```bash
GET /authenticated?code=8V1pr0rJ&state=Lwt50DDQKUB8U7jtfLQCVGDL9cnmwHH1
HTTP/1.1 Host: localhost:3000
```

Notice that this HTTP request is to the client and not on the authorization server.

## Step 3: Owner authorizes client app

![Owner authorizes client app](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/images/oauth2-flow/steps/3-owner-authorize-client.png "Owner authorizes client app")

## Step 4: Auth server redirects owner with authorization code

Since we’re using the authorization code grant type, this redirect includes the spe- cial `code` query parameter. The value of this parameter is a one-time-use credential known as the *authorization code*, and it represents the result of the user’s authorization decision.

![Auth server redirects owner with authorization code](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/images/oauth2-flow/steps/4-auth-server-redirects-owner-auth-code.png "Auth server redirects owner with authorization code")

 The client can parse this parameter to get the authorization code value when the request comes in, and it will use that code in the next step. The client will also check that the value of the `state` parameter matches the value that it sent in the previous step.

## Step 5: Client app requests Access token from Auth server

The client performs an HTTP `POST` with its parameters as a form-encoded HTTP entity body, passing its `client_id` and `client_secret` as an *HTTP Basic* authorization header. This HTTP request is made directly between the client and the authorization server, without involving the browser or resource owner at all.


![Client app requests Access token from Auth server](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/images/oauth2-flow/steps/5-client-request-token.png "Client app requests Access token from Auth server")

```bash
POST /site/oauth2/access_token
Host: api.bitbucket.com
Accept: application/json
Content-type: application/x-www-form-encoded
Authorization: Basic b2F1dGgtY2xpZW50LTE6b2F1dGgtY2xpZW50LXNlY3JldC0x
grant_type=authorization_code& redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauthenticated&code=8V1pr0rJ
```

This separation between different HTTP connections ensures that the client can authenticate itself directly without other components being able to see or manipulate the token request.

## Step 6: Auth server issues access token to client to access resource

The authorization server takes in this request and, if valid, issues a token

![Auth server issues access token to client to access resource](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/images/oauth2-flow/steps/6-server-issues-token-client.png "Auth server issues access token to client to access resource")

## Step 7: Client uses access token to access protected resource

![Client uses access token to access protected resource](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/images/oauth2-flow/steps/7-client-use-token-access-resource.png "Client uses access token to access protected resource")
