const port = 3000

const hosts = {
  server: 'api.bitbucket.com',
  client: `localhost:${port}`
}

// Bitbucket authorization server
var authServer = {
  authorizationUrl: `http://${hosts.server}/authorize`,
};

// client app information
var client = {
  client_id: process.env.bitbucketKey,
  client_secret: process.env.bitbucketSecret,
  redirect_uri: `http://${hosts.client}/authenticated`
};

module.exports = {
  port,
  hosts,
  authServer,
  client
}
