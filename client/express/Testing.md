# Testing

You need to run the tests with the following ENV variables set.
Can be done directly, when you run from CLI.

Alterntively load secret credentials from a `.json` config file that is git ignored via `.gitignore` such as `test/secret/access-tokens.json`

```js
  client_id: process.env.bitbucketKey,
  client_secret: process.env.bitbucketSecret,
```

A sample `access-tokens.json` file has been included for your convenience.

## Express app Request testing

Tests are run via `ava` using `supertest` to make requests and assertions on result.

Various valid and invalid request types for each route are tested to ensure OAuth2 flow is covered and works according to specs and security standards.


