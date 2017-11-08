import {
  BitBucketClient
} from '../bitbucket/client'

export class SampleBitBucketClient {
  constructor(opts = {}) {
    super(opts)
    this.init()
  }

  init() {
    this.log('init', this.constructor.name)
    // fill placeholder on UI
    this.select('.oauth-scope-value').text(this.client.scope);

    // UI button click handler
    this.select('#authorize').on('click', this.handleAuthorizationRequestClick);
    this.select('.oauth-fetch-resource').on('click', this.handleFetchResourceClick);

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

  select(selector) {
    return this.$(selector)
  }

  resourceDisplayElem(opts) {
    if (!(opts.target || opts.id)) {
      this.handleError('resourceDisplayElem: missing event target or id', opts)
    }
    const id = opts.id || opts.target.id
    const displayId = opts.target.id === 'fetch-repo' ? 'repo' : 'user'
    return this.select('#' + displayId)
  }

  onFailure(opts) {
    super.onFailure()
    this.resourceDisplayElem(opts).text('Error while fetching the protected resource');
  }

  onSuccess(opts) {
    super.onSuccess(opts)
    const prettyData = JSON.stringify(opts.data, null, 2)
    this.resourceDisplayElem(opts).text(prettyData);
  }

  onStateMatch(callbackData) {
    this.select('#access_token').text(callbackData.access_token);
    this.log('access_token: ', callbackData.access_token);
  }

  onStateMismatch() {
    this.error('State DOES NOT MATCH: expected %s got %s', this.localState, callbackData.state);
    this.callbackData = null;
    this.select('#state').text("Error state value did not match");
  }
}
