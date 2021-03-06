export class BaseAuthClient {
  constructor(opts = {}) {
    const {
      client,
      $,
      ajax,
      logging
    } = opts
    if (!client) {
      this.validationErr('BitBucketClient must take a client option (Object)', opts)
    }
    if (client.redirect_uri) {
      client.redirect_uris = [client.redirect_uri]
    }
    this.logging = logging
    this.client = this.validateClientConfig(client)
    this.$ = $
    this.ajax = ajax || $.ajax
    this.callbackData = null
    this.authorizationEndpoint = opts.authorizationEndpoint
  }

  handlError(msg, data) {
    this.error(msg, data)
    throw new Error(msg)
  }

  get authServer() {
    if (!this.authorizationEndpoint) {
      this.handlError('authServer: missing authorizationEndpoint')
    }
    return {
      authorizationEndpoint: this.authorizationEndpoint
    }
  }

  get clientRequiredKeys() {
    return ['client_id', 'redirect_uris', 'scope']
  }

  log(...msgs) {
    if (this.logging) {
      console.log(...msgs)
    }
  }

  error(...msgs) {
    console.error(...msgs)
  }

  validateClientConfig(client) {
    this.log('validateClientConfig', config)
    this.clientRequiredKeys.map(key => {
      if (!client[key]) {
        this.validationErr(`missing ${key}`, client)
      }
    })
    if (typeof client.client_id !== 'string') {
      this.validationErr(`client_id must be a string`, client.client_id)
    }
    if (typeof client.sceope !== 'string') {
      this.validationErr(`scope must be a string`, client.scope)
    }
    if (!Array.isArray(client.redirect_uris)) {
      this.validationErr(`redirect_uris must be an Array`, client.redirect_uris)
    }
    return client
  }

  validationErr(msg, data) {
    this.error(msg, data)
    throw new Error(msg)
  }

  generateState(length) {
    this.log('generateState', length)
    let state = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      // add random character
      state += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return state;
  }

  authorize() {
    this.log('authorize')
    const state = this.generateState(32);
    this.state = state

    // save local state (by default in localstorage)
    this.localState = state

    const {
      scope,
      client_id,
      redirect_uris,
      redirect_uri
    } = this.client

    const {
      authorizationEndpoint
    } = this.authServer

    location.href = authorizationEndpoint + '?' +
      'response_type=token' +
      '&state=' + state +
      '&scope=' + encodeURIComponent(scope) +
      '&client_id=' + encodeURIComponent(client_id) +
      '&redirect_uri=' + encodeURIComponent(redirect_uris[0] || redirect_uri);

    return this
  }

  get defaultHttpMethod() {
    return 'POST'
  }

  get defaultRequestSettings() {
    return {
      type: this.defaultHttpMethod,
      crossDomain: true,
      dataType: 'json',
    }
  }

  buildRequestObj(data = {}) {
    this.log('requestObj', data)
    const {
      callbackData,
      resourceUrl,
      method
    } = data
    const requestObj = Object.assign(this.defaultRequestSettings, {
      url: resourceUrl,
      headers: {
        'Authorization': 'Bearer ' + callbackData.access_token
      }
    })
    this.log('request', requestObj)
    return requestObj
  }

  fetchResource = (opts) => {
    const {
      resourceUrl,
      method
    } = opts
    const {
      $,
      ajax,
      callbackData
    } = this

    if (callbackData != null) {
      const requestObj = this.buildRequestObj({
        resourceUrl,
        method,
        callbackData
      })
      this.log('make ajax request using', requestObj)
      this.makeAjaxRequest(requestObj)
    }
    return this
  }

  makeAjaxRequest(requestObj) {
    // Note: passes on original opts
    // this is so it can take whatever info necessary for updating display
    // such as the target DOM element of the event initiating it
    // as used in the SampleClient example
    this.ajax(requestObj).done((data) => {
      const payload = Object.assign(opts, {
        data
      })
      this.log('success', payload)
      this.onSuccess(payload)
    }).fail(() => {
      const payload = opts
      this.log('failure', payload)
      this.onFailure(payload)
    });
  }

  onFailure(opts) {
    this.error('fetchResource: Failure', opts)
  }

  onSuccess(opts) {
    this.log('fetchResource: Succes', JSON.stringify(data))
  }

  get whitelist() {
    return ['access_token', 'state']; // for parameters
  }

  processCallback = () => {
    this.log('processCallback')
    const {
      $,
    } = this
    let {
      callbackData
    } = this

    var hash = location.hash.substring(1);

    callbackData = {};

    this.log('parse location.hash', hash)
    hash.split('&').forEach(function (e) {
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
    this.log('access_token: ', callbackData.access_token);
  }

  onStateMismatch() {
    this.log('State DOES NOT MATCH: expected %s got %s', this.localState, callbackData.state);
    this.callbackData = null;
  }
}
