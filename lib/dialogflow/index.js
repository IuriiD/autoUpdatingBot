const Dialogflow = require('dialogflow');

const projectId = process.env.PROJECT_ID;

const dfCredentials = {
  projectId,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
};

const intentsClient = new Dialogflow.IntentsClient(dfCredentials);
const agentPath = intentsClient.projectAgentPath(projectId);

async function getIntent(intentPath) {
  const response = await intentsClient.getIntent({
    name: intentPath,
    intentView: 'INTENT_VIEW_FULL',
  });

  if (response) return response[0];
  return false;
}

async function updateIntent(intentPath, newTrainingPhrase) {
  const intent = await getIntent(intentPath);
  if (!intent) throw new Error(`Failed to find an intent ${intentPath}`);

  const newTrainingPhraseObj = {
    parts: [
      {
        text: newTrainingPhrase,
      },
    ],
    type: 'EXAMPLE',
  };
  intent.trainingPhrases.push(newTrainingPhraseObj);

  const response = await intentsClient.updateIntent({ intent });
  return response;
}

async function createIntent(displayName, trainingPhrasesParts, messageTexts) {
  const trainingPhrases = [];

  trainingPhrasesParts.forEach((trainingPhrasesPart) => {
    const part = {
      text: trainingPhrasesPart,
    };

    // Here we create a new training phrase for each provided part.
    const trainingPhrase = {
      type: 'EXAMPLE',
      parts: [part],
    };

    trainingPhrases.push(trainingPhrase);
  });

  const messageText = {
    text: messageTexts,
  };

  const message = {
    text: messageText,
  };

  const intent = {
    displayName,
    trainingPhrases,
    messages: [message],
    webhookState: 'WEBHOOK_STATE_ENABLED',
  };

  const createIntentRequest = {
    parent: agentPath,
    intent,
  };

  // Create the intent
  const responses = await intentsClient.createIntent(createIntentRequest);
  return responses;
}

module.exports = {
  createIntent,
  updateIntent,
};
