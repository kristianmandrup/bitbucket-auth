// var client = {
//   'client_id': 'oauth-client-1',
//   'redirect_uris': ['http://localhost:9000/callback'],
//   'scope': 'foo bar'
// };
export class BitBucketClient {
  constructor(opts = {}) {
    const {
      client,
      $,
      ajax
    } = opts
    if (!client) {
      this.validationErr('BitBucketClient must take a client option (Object)', opts)
    }
    if (client.redirect_uri) {
      client.redirect_uris = [client.redirect_uri]
    }
    this.client = this.validateClientConfig(client)
    this.$ = $
    this.ajax = ajax || $.ajax
    this.callbackData = null
  }

  get clientRequiredKeys() {
    return ['client_id', 'redirect_uris', 'scope']
  }

  validateClientConfig(client) {
    this.clientRequiredKeys.map(key => {
      if (!client[key]) {
        this.validationErr(`missing ${key}`, client)
      }
    })
    if (typeof client.client_id !== 'string') {
      this.validationErr(`client_id must be a string`, client.client_id)
    }
    if (typeof client.sceope !== 'string') {
      this.validationErr(`sceope must be a string`, client.scope)
    }
    if (!Array.isArray(client.redirect_uris)) {
      this.validationErr(`redirect_uris must be an Array`, client.redirect_uris)
    }
  }

  validationErr(msg, data) {
    console.error(msg, data)
    throw new Error(msg)
  }

  get authServer() {
    return {
      authorizationEndpoint: 'https://bitbucket.org/site/oauth2/authorize'
    }
  }

  execute() {
    const {
      $
    } = this
    // fill placeholder on UI
    $('.oauth-scope-value').text(this.client.scope);

    // UI button click handler
    $('.oauth-authorize').on('click', this.handleAuthorizationRequestClick);
    $('.oauth-fetch-resource').on('click', this.handleFetchResourceClick);

    // we got a hash as a callback
    if (location.hash) {
      this.processCallback();
    }
  }

  generateState(len) {
    let ret = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < len; i++) {
      // add random character
      ret += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return ret;
  }

  handleAuthorizationRequestClick = (ev) => {
    const state = this.generateState(32);
    this.state = state

    localStorage.setItem('oauth-state', state);

    location.href = authServer.authorizationEndpoint + '?' +
      'response_type=token' +
      '&state=' + state +
      '&scope=' + encodeURIComponent(client.scope) +
      '&client_id=' + encodeURIComponent(client.client_id) +
      '&redirect_uri=' + encodeURIComponent(client.redirect_uris[0] || client.redirect_uri);
  }

  handleFetchResourceClick = (ev) => {
    const {
      $,
      ajax,
      callbackData
    } = this

    if (callbackData != null) {
      ajax({
        url: this.protectedResource,
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        headers: {
          'Authorization': 'Bearer ' + callbackData.access_token
        }
      }).done(function (data) {
        this.onSuccess(data)
      }).fail(function () {
        this.onFailure()
      });

    }
  }

  onFailure() {
    $('.oauth-protected-resource').text('Error while fetching the protected resource');
  }

  onSuccess(data) {
    $('.oauth-protected-resource').text(JSON.stringify(data));
  }

  processCallback = () => {
    const {
      $,
    } = this
    let {
      callbackData
    } = this

    var h = location.hash.substring(1);
    var whitelist = ['access_token', 'state']; // for parameters

    callbackData = {};

    h.split('&').forEach(function (e) {
      var d = e.split('=');
      var key = d[0]
      var value = d[1]
      if (whitelist.indexOf(key) > -1) {
        // set callbackData.state = state and more ...
        callbackData[key] = value;
      }
    });

    if (callbackData.state !== localStorage.getItem('oauth-state')) {
      this.onStateMismatch()
    } else {
      onStateMatch(callbackData)
    }
  }

  onStateMatch(callbackData) {
    $('.oauth-access-token').text(callbackData.access_token);
    console.log('access_token: ', callbackData.access_token);
  }

  onStateMismatch() {
    console.log('State DOES NOT MATCH: expected %s got %s', localStorage.getItem('oauth-state'), callbackData.state);
    this.callbackData = null;
    $('.oauth-protected-resource').text("Error state value did not match");
  }

}
