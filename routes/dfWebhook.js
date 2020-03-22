const express = require('express');
const ga = require('actions-on-google');
const df = require('../lib/dialogflow');
const helpers = require('../helpers');

const router = express.Router();

const gaApp = ga.dialogflow({
  debug: false,
  clientId: process.env.CLIENT_ID,
});

router.post('/webhook', gaApp);

const userInputBuffer = {};

gaApp
  .fallback(async (conv) => {
    const { intent } = conv;
    const sessionId = helpers.getSession(conv);

    switch (intent) {
      case 'Add_Rule': {
        const { training_phrase, bots_response } = conv.parameters; /* eslint-disable-line camelcase */
        await df.createIntent(
          helpers.createIntentName(training_phrase),
          [training_phrase] /* eslint-disable-line camelcase */,
          [bots_response] /* eslint-disable-line camelcase */,
        );
        conv.ask(conv.body.queryResult.fulfillmentText);
        break;
      }

      case 'Default Fallback Intent': {
        console.log('conv.query=', conv.query);
        console.log(JSON.stringify(conv));
        userInputBuffer[sessionId] = conv.query;
        conv.ask(conv.body.queryResult.fulfillmentText);
        break;
      }

      case 'Default Fallback Intent - no': {
        delete userInputBuffer[sessionId];
        conv.ask(conv.body.queryResult.fulfillmentText);
        break;
      }

      case 'Default Fallback Intent - yes': {
        const training_phrase = userInputBuffer[sessionId]; /* eslint-disable-line camelcase */
        conv.followup('add_rule', { training_phrase });
        break;
      }

      default:
        return conv.ask(conv.body.queryResult.fulfillmentText);
    }
  })
  .catch((conv, error) => {
    console.log(error);
    return conv.ask('Ups, something went wrong... Please try again later.');
  });

module.exports = router;
