(function () {
  var callbackData;

  // client information
  var client = {
    'client_id': 'oauth-client-1',
    'redirect_uris': ['http://localhost:9000/callback'],
    'scope': 'foo bar'
  };

  // authorization server information
  var authServer = {
    authorizationEndpoint: 'http://localhost:9001/authorize'
  };

  var protectedResource = 'http://localhost:9002/resource';

  function generateState(len) {
    var ret = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < len; i++) {
      // add random character
      ret += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return ret;
  }

  function handleAuthorizationRequestClick(ev) {
    var state = generateState(32);

    localStorage.setItem('oauth-state', state);

    location.href = authServer.authorizationEndpoint + '?' +
      'response_type=token' +
      '&state=' + state +
      '&scope=' + encodeURIComponent(client.scope) +
      '&client_id=' + encodeURIComponent(client.client_id) +
      '&redirect_uri=' + encodeURIComponent(client.redirect_uris[0]);
  }

  function handleFetchResourceClick(ev) {
    if (callbackData != null) {

      $.ajax({
        url: protectedResource,
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        headers: {
          'Authorization': 'Bearer ' + callbackData.access_token
        }
      }).done(function (data) {
        $('.oauth-protected-resource').text(JSON.stringify(data));
      }).fail(function () {
        $('.oauth-protected-resource').text('Error while fetching the protected resource');
      });

    }
  }

  function processCallback() {
    var h = location.hash.substring(1);
    var whitelist = ['access_token', 'state']; // for parameters

    callbackData = {};

    h.split('&').forEach(function (e) {
      var d = e.split('=');

      if (whitelist.indexOf(d[0]) > -1) {
        callbackData[d[0]] = d[1];
      }
    });

    if (callbackData.state !== localStorage.getItem('oauth-state')) {
      console.log('State DOES NOT MATCH: expected %s got %s', localStorage.getItem('oauth-state'), callbackData.state);
      callbackData = null;
      $('.oauth-protected-resource').text("Error state value did not match");
    } else {
      $('.oauth-access-token').text(callbackData.access_token);
      console.log('access_token: ', callbackData.access_token);
    }
  }

  // fill placeholder on UI
  $('.oauth-scope-value').text(client.scope);

  // UI button click handler
  $('.oauth-authorize').on('click', handleAuthorizationRequestClick);
  $('.oauth-fetch-resource').on('click', handleFetchResourceClick);

  // we got a hash as a callback
  if (location.hash) {
    processCallback();
  }

}());
