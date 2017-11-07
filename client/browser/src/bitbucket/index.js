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

    // save local state (by default in localstorage)
    this.localState = state

    location.href = authServer.authorizationEndpoint + '?' +
      'response_type=token' +
      '&state=' + state +
      '&scope=' + encodeURIComponent(client.scope) +
      '&client_id=' + encodeURIComponent(client.client_id) +
      '&redirect_uri=' + encodeURIComponent(client.redirect_uris[0] || client.redirect_uri);
  }

  buildAjaxObj(data = {}) {
    const {
      callbackData,
      resourceUrl,
      method
    } = data
    return {
      url: resourceUrl,
      type: 'POST',
      crossDomain: true,
      dataType: 'json',
      headers: {
        'Authorization': 'Bearer ' + callbackData.access_token
      }
    }
  }

  fetchResource = ({
    resourceUrl,
    method
  }) => {
    const {
      $,
      ajax,
      callbackData
    } = this

    if (callbackData != null) {
      const requestObj = this.buildAjaxObj({
        resourceUrl,
        method,
        callbackData
      })
      ajax(requestObj).done(function (data) {
        this.onSuccess(data)
      }).fail(function () {
        this.onFailure()
      });

    }
  }

  onFailure() {
    console.error('fetchResource: Failure')
  }

  onSuccess(data) {
    console.log('fetchResource: Succes', JSON.stringify(data))
  }

  get whitelist() {
    return ['access_token', 'state']; // for parameters
  }

  processCallback = () => {
    const {
      $,
    } = this
    let {
      callbackData
    } = this

    var h = location.hash.substring(1);


    callbackData = {};

    h.split('&').forEach(function (e) {
      var d = e.split('=');
      var key = d[0]
      var value = d[1]
      // process whitelisted params of result
      if (this.whitelist.indexOf(key) > -1) {
        // set callbackData.state = state and more ...
        callbackData[key] = value;
      }
    });

    if (callbackData.state !== this.localState) {
      this.onStateMismatch()
    } else {
      onStateMatch(callbackData)
    }
  }

  get oauthStateKey() {
    return 'oauth-state'
  }

  get storage() {
    return localStorage
  }

  get localState() {
    return this.storage.getItem(this.oauthStateKey)
  }

  set localState(state) {
    this.storage.setItem(this.oauthStateKey, state);
  }


  onStateMatch(callbackData) {
    console.log('access_token: ', callbackData.access_token);
  }

  onStateMismatch() {
    console.log('State DOES NOT MATCH: expected %s got %s', this.localState, callbackData.state);
    this.callbackData = null;
  }
}
