const {
  log,
  error
} = console

function createFetchResource(config = {}) {
  let {
    authState,
    accessToken
  } = config

  // Testing fetching of actual resource via bitbucket API
  return function fetchResource(req, res, next) {
    if (!accessToken) {
      res.render('error', {
        error: 'Missing access token.'
      });
      return;
    }
    // TODO: fetch resource using accessToken
  }
}


module.exports = {
  createFetchResource
}
