const express = require('express');
const ga = require('actions-on-google');
const df = require('../lib/dialogflow');
const helpers = require('../helpers');
const { getUtteranceVariants } = require('../lib/ai21');

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

        let trainingPhrases = [training_phrase]; /* eslint-disable-line camelcase */
        const utteranceVariants = await getUtteranceVariants(training_phrase);
        if (utteranceVariants) {
          trainingPhrases = [...trainingPhrases, ...utteranceVariants];
        }

        await df.createIntent(
          await helpers.createIntentName(training_phrase, 'jpt-j'),
          trainingPhrases,
          [bots_response] /* eslint-disable-line camelcase */,
        );
        conv.ask(conv.body.queryResult.fulfillmentText);
        break;
      }

      case 'Default Fallback Intent': {
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

      default: {
        const { intentDetectionConfidence } = conv.body.queryResult;
        const thresholdIntentDetectionConfidence = parseFloat(process.env.CONFIDENCE_LIMIT_FOR_INTENT_UPDATE) || 0.6;
        if (intentDetectionConfidence >= thresholdIntentDetectionConfidence) {
          const { name: intentPath } = conv.body.queryResult.intent;
          const newPhrase = conv.query;
          await df.updateIntent(intentPath, newPhrase);
          return conv.ask(conv.body.queryResult.fulfillmentText);
        }
        return conv.ask(conv.body.queryResult.fulfillmentText);
      }
    }
  })
  .catch((conv, error) => {
    console.log(error);
    return conv.ask('Ups, something went wrong... Please try again later.');
  });

module.exports = router;
