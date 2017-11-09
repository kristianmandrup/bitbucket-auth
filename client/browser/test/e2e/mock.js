import {
  nock,
  port,
  expected
} from './_util'

// defaults: same as callbackUrl
// Equivalent to: http://localhost:3000/auth-callback?access_token=${expected.token}&state=${expected.state}
export const nockConfig = {
  // simulate bitbucket callback to deliver access token in query string for browser app
  callback: {
    host: `http://localhost:${port}`,
    method: 'get',
    route: 'auth-callback',
    query: {
      access_token: expected.token,
      state: expected.state
    },
    code: 200,
    body: {}
  },
  // simulate bitbucket authorize request
  authorize: {
    host: 'https://api.bitbucket.org',
    method: 'post',
    route: 'site/oauth2/authorize',
    post: {
      client_id: 'my-client'
    },
    code: 302, // 302 found is used to signal redirect
    body: {}
  },
  // simulated fetch resource username/reponame
  fetchRepo: {
    host: 'https://api.bitbucket.org',
    method: 'get',
    route: 'username/reponame',
    code: 200,
    body: {
      repo: 'found'
    }
  },
  fetchUser: {
    host: 'https://api.bitbucket.org',
    method: 'get',
    route: 'users/username',
    code: 200,
    body: {
      repo: 'found'
    }
  }
}

// nock simulater, using nockConfig or opts to drive nock API
//
export function mockRequest(type, opts = {}) {
  const typeConfig = nockConfig[type]
  const keys = Object.keys(typeConfig)

  // build config by merging, overriding any with opts
  const config = Object.assign({}, typeConfig, opts)

  const route = nock(config.host)[config.method]('/' + config.route)
  // how to send params, via query params or a post
  const paramsType = clientConfig['query'] ? 'query' : 'post'

  route[paramsType](config[paramsType])
    .reply(config.code, config.body)
}

const callback = nockConfig.callback
export const callbackUrl = [callback.host, callback.route, `access_token=${expected.token}&state=${expected.state}`]
export const indexPage = `http://localhost:${port}`
