# Express client

This folder contains an outline of an [Express](expressjs.com/) server (ie. a back-end client app) for [Bitbucket OAuth authentication](https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html
) which grants access to use the [Bitbucket API](https://confluence.atlassian.com/bitbucket/use-the-bitbucket-cloud-rest-apis-222724129.html).

The app is partly modelled on the generic server from the book [OAuth2 in Action](https://www.manning.com/books/oauth-2-in-action)

Please feel free to help improve this server, making it more modular, with support for more flows, grant types etc.

## Routes

The `/routes` contains the following route factories

- `createAuthCallback`
- `createAuthorize`
- `createFetchResource`

Each return an express route of the form `(req, res, next)`
