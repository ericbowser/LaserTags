var request = require("request");

var options = { method: 'POST',
  url: 'https://dev-nx945r7l.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: '{"client_id":"JTk1ghk461a7pYPC3Z2qMJXqQtFFaXG0","client_secret":"69eSVN_JR5tniy62EtNmuCGBn9mWnj9tYHdHOJMfkO5PI4hBcbj6vGCJ9FLEtLb2","audience":"https://dev-nx945r7l.auth0.com/api/v2/","grant_type":"client_credentials"}' };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});