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
