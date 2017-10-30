# Extra protection

## Adding cross-site protection with the state parameter

Any time someone comes to `http://localhost:9000/` callback, the client will naively take in the input code value and attempt to post it to the authorization server. This would mean that an attacker could use our client to fish for valid authorization codes at the authorization server, wasting both client and server resources and potentially causing our client to fetch a token it never requested.

We can mitigate this by using an optional OAuth parameter called `state`, which we’ll fill with a random value and save to a variable on our application.

Right after we throw out our old access token, we’ll create this value:

```js
state = randomstring.generate();
```

It’s important that this value be saved to a place in our application that will still be available when the call to the `redirect_uri` comes back
