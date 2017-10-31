# TODO

## Main src code

`getAccessToken()` and the rest need major refactoring to be split into smaller parts, classes etc. that are more composable than the "mess" we have now.

We especially need to split out the different grant type flows, so they are not lumped together. We also need to support all 4 grant types!

The grant types available for the browser (ie. front-flow only, such as implicit grant) needs to be packaged for the browser, using babel and webpack build config.

## Client

The `/client` folder needs some major work in order to provide sample clients and parts that are ready for real life action!!

### Improve Express app w promises and router

We could/should improve the Express sample client app with Promise support and use a (proper) Router

- [express-promise](https://github.com/luin/express-promise)
- [express-promise-router](https://www.npmjs.com/package/express-promise-router)

## Call for help

Please help improve this library!
