import { getMessageWithKeyword } from './database';

const request = require('request');

/** ********* Helper function for messaging ********* */
// Handles messages events
function handleMessage(sender_psid, received_message) {

  if (!received_message.text) {
    return;
  }
  const messagePromise = getMessageWithKeyword(received_message.text);
  messagePromise.then(function (responseMsg) {
    if (responseMsg !== null) {
      // Sends the response message
      console.log(responseMsg);
      callSendAPI(sender_psid, responseMsg);
    }
  }, function (reason) {
    // on reject
  });

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  const request_body = {
    'recipient': {
      'id': sender_psid,
    },
    'message': {
      'text': response,
    },
  };

  // Send the HTTP request to the Messenger Platform
  request({
    'uri': 'https://graph.facebook.com/v2.6/me/messages',
    'qs': {'access_token': process.env.PAGE_ACCESS_TOKEN},
    'method': 'POST',
    'json': request_body,
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!');
      console.log(body);
    } else {
      console.error('Unable to send message:' + err);
    }
  });

}

module.exports = {handleMessage, callSendAPI};
