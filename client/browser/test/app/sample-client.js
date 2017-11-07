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
    $('.oauth-authorize').on('click', this.handleAuthorizationRequestClick);
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
      method
    })
  }

  onFailure() {
    super.onFailure()
    $('.oauth-protected-resource').text('Error while fetching the protected resource');
  }

  onSuccess(data) {
    super.onSuccess(data)
    $('.oauth-protected-resource').text(JSON.stringify(data));
  }

  onStateMatch(callbackData) {
    $('.oauth-access-token').text(callbackData.access_token);
    this.log('access_token: ', callbackData.access_token);
  }

  onStateMismatch() {
    this.error('State DOES NOT MATCH: expected %s got %s', this.localState, callbackData.state);
    this.callbackData = null;
    $('.oauth-protected-resource').text("Error state value did not match");
  }
}
