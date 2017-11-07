import {
  BitBucketClient
} from './'

export class SampleBitBucketClient {
  constructor(opts = {}) {
    super(opts)
    this.init()
  }

  init() {
    this.log('init', this.constructor.name)

    const {
      $
    } = this
    // fill placeholder on UI
    $('.oauth-scope-value').text(this.client.scope);

    // UI button click handler
    $('#authorize').on('click', this.handleAuthorizationRequestClick);
    $('.oauth-fetch-resource').on('click', this.handleFetchResourceClick);

    // we got a hash as a callback
    if (location.hash) {
      this.processCallback();
    }
    return this
  }

  get defaultMethod() {
    return 'post'
  }

  handleAuthorizationRequestClick = (ev) => {
    this.log('handleAuthorizationRequestClick', ev)
    this.authorize()
  }

  // triggers when a HTML DOM element that has a data-resource attribute is clicked
  handleFetchResourceClick = (ev) => {
    this.log('handleFetchResourceClick', ev)
    const {
      target,
    } = ev
    const {
      dataset
    } = target
    if (!dataset && dataset.resource) {
      throw new Error('target element must have a data-resource attribute to indicate what to fetch on click')
    }
    let {
      resource,
      method
    } = dataset
    method = method || this.defaultMethod

    this.fetchResource({
      resource,
      method,
      target
    })
  }

  resourceDisplayElem(opts) {
    const displayId = opts.target.id === 'fetch-repo' ? 'repo' : 'user'
    return $('#' + displayId)
  }

  onFailure(opts) {
    super.onFailure()
    this.resourceDisplayElem(opts).text('Error while fetching the protected resource');
  }

  onSuccess(opts) {
    super.onSuccess(opts)
    this.resourceDisplayElem(opts).text(JSON.stringify(opts.data));
  }

  onStateMatch(callbackData) {
    $('#access_token').text(callbackData.access_token);
    this.log('access_token: ', callbackData.access_token);
  }

  onStateMismatch() {
    this.error('State DOES NOT MATCH: expected %s got %s', this.localState, callbackData.state);
    this.callbackData = null;
    $('#state').text("Error state value did not match");
  }
}
