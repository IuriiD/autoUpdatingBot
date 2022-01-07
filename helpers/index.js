const { detectIntentNlpcloud } = require('../lib/nlpcloud');

function createIntentNameSimple(firstTrainingPhrase) {
  const trainingPhraseReplaced = firstTrainingPhrase.replace(/\s/g, '_');
  const strLength = trainingPhraseReplaced.length;
  let strFixedLength = '';
  if (strLength > 20) {
    strFixedLength = trainingPhraseReplaced.substring(0, 21);
  } else {
    const filler = '_'.repeat(20 - strLength);
    strFixedLength = `${trainingPhraseReplaced}${filler}`;
  }
  return `${strFixedLength}_${Date.now()}`;
}

async function createIntentNameJptJ(firstTrainingPhrase) {
  return detectIntentNlpcloud(firstTrainingPhrase);
}

async function createIntentName(firstTrainingPhrase, method = 'default') {
  let intentName = '';

  if (method === 'jpt-j') {
    intentName = await createIntentNameJptJ(firstTrainingPhrase);
    console.log('intent name from jpt-j:', intentName);
    return intentName || createIntentNameSimple(firstTrainingPhrase);
  }
  return createIntentNameSimple(firstTrainingPhrase);
}

function getSession(conv) {
  const { session } = conv.body;
  const sessionIdArr = session.split('/');
  return sessionIdArr[sessionIdArr.length - 1];
}

module.exports = {
  createIntentName,
  getSession,
};
