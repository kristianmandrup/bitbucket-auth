# Grant types

## Choosing grant type

Consult this diagram when choosing a suitable OAuth2 grant type for your specific scenario.

![Choosing grant type](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/images/grant-types/Choosing-grant-type.png "Choosing grant type")

## Implicit grant type

The implicit grant type is useful when your application is a modern Single Page App (SPA).

![Implicit grant type](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/images/grant-types/Implicit-grant-type.png "Implicit grant type")

The implicit grant type does away with this extra secret and its attendant round trip by returning the token directly from the authorization endpoint.

The implicit grant type therefore uses only the front channel to communicate with the authorization server.

This flow is very useful for JavaScript applications embedded within websites that need to be able to perform an authorized, and potentially limited, session sharing across security domains.

## Client credentials grant type

The client credentials grant type is useful when there is no explicit resource owner, or the resource owner is indistinguishable from the client software itself.

This is a fairly common situation, in which there are back-end systems that need to communicate directly with each other and not necessarily on behalf of any one particular user.

![Client credentials grant type](https://github.com/kristianmandrup/bitbucket-auth/blob/master/docs/images/grant-types/Client-credentials-grant-type.png "Client credentials grant type")

In the implicit flow, the client is pushed up into the browser and therefore into the front channel; in this flow, the resource owner is pushed down into the client and the user agent disappears from the picture. As a consequence, this flow makes exclusive use of the back channel, and the client acts on its own behalf (as its own resource owner) to get the access token from the token endpoint.
