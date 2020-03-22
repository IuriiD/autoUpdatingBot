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
};
