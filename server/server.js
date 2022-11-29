var express = require('express');
var jwt = require('jwt-simple');
var secret = 'secret_key';
var channel = 'channel_id';
var app = express();

function hasChannelAccess(req) {
  return true;
}


app.get('/jwt', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*'); // for developing
  if (hasChannelAccess(req)) {
    console.log(req.query);
    var clientId = req.query.clientId;
    var payload = {
      client: clientId, // the client that wants to connect
      channel: channel, // channel_id the client want's to connect to
      permissions: {
        '^general-chat$': { /* Regex exact match to general-chat */
          publish: true, /* Allows publishing in general-chat */
          subscribe: true
        }
      },
      exp: Date.now() + 180000 // Client can use this token for 3 minutes (UTC0)
    };
    console.log(payload);
    var token = jwt.encode(payload, secret, 'HS256');
    res.send(token);
  } else {
    res.send(403, 'Sorry! You are not allowed.');
  }
});

app.listen(1234);
console.log('Server is running..');