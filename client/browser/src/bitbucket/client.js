import {
  BaseAuthClient
} from '../base'

// var client = {
//   'client_id': 'oauth-client-1',
//   'redirect_uris': ['http://localhost:9000/callback'],
//   'scope': 'foo bar'
// };
export class BitBucketClient extends BaseAuthClient {
  constructor(opts = {}) {
    super(opts)
  }

  get authServer() {
    return {
      authorizationEndpoint: 'https://bitbucket.org/site/oauth2/authorize'
    }
  }
}
