const NLPCloudClient = require('nlpcloud');

const { NLPCLOUD_API_TOKEN } = process.env;

const client = new NLPCloudClient('gpt-j', NLPCLOUD_API_TOKEN, true);

function getFewShotLearningPrimer(input) {
  return `I want to start coding tomorrow because it seems to be so fun!
              Intent: start coding
              ###
              Show me the last pictures you have please.
              Intent: show pictures
              ###
              Search all these files as fast as possible.
              Intent: search files
              ###
              ${input}
              Intent:`;
}

const config = {
  minLength: 0,
  maxLength: 20,
  lengthNoInput: true,
  endSequence: '###',
  removeInput: true,
  doSample: true,
  numBeams: 1,
  earlyStopping: false,
  noRepeatNgramSize: 0,
  numReturnSequences: 1,
  topK: 0,
  topP: 0.7,
  temperature: 1.0,
  repetitionPenalty: 1.0,
  lengthPenalty: 1.0,
};

async function detectIntentNlpcloud(input) {
  return new Promise((resolve, reject) => {
    client
      .generation(
        getFewShotLearningPrimer(input),
        config.minLength,
        config.maxLength,
        config.lengthNoInput,
        config.endSequence,
        config.removeInput,
        config.doSample,
        config.numBeams,
        config.earlyStopping,
        config.noRepeatNgramSize,
        config.numReturnSequences,
        config.topK,
        config.topP,
        config.temperature,
        config.repetitionPenalty,
        config.lengthPenalty,
      )
      .then((response) => {
        console.log(response.data);
        if (response.data) {
          const generatedTextTrimmed = response.data.generated_text.replace('###', '').trim();
          return resolve(generatedTextTrimmed);
        }
        resolve(null);
      })
      .catch((err) => {
        console.error(err.response.status);
        console.error(err.response.data.detail);
        reject(err);
      });
  });
}

module.exports = {
  detectIntentNlpcloud,
};
