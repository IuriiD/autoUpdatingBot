const axios = require('axios');

const { AI21_API_TOKEN } = process.env;

async function getUtteranceVariants(utterance, variants = 5) {
  try {
    const url = 'https://api.ai21.com/studio/v1/j1-jumbo/complete';

    const headers = { Authorization: `Bearer ${AI21_API_TOKEN}` };

    const payload = {
      prompt: `Intent: What will be the weather tomorrow?
        3 Utterances:
        - Tell me the weather forecast for Canada
        - Will there be wind in Palo Alto, California
        - What is the weather forecast
        ###
        Intent:${utterance}
        ${variants} Utterances:`,
      numResults: 1,
      maxTokens: 60,
      stopSequences: ['###'],
      topP: 1.0,
      topKReturn: 0,
      temperature: 0.7,
    };

    const resp = await axios.post(url, payload, { headers });
    // console.log(JSON.stringify(resp.data));

    if (
      resp.data &&
      resp.data.completions &&
      resp.data.completions.length &&
      resp.data.completions[0].data &&
      resp.data.completions[0].data.text
    ) {
      let utterancesArrFormatted = resp.data.completions[0].data.text
        .split('\n')
        .map((eachUtterance) => eachUtterance.replace('-', '').trim())
        .filter((nonEmpty) => nonEmpty);
      utterancesArrFormatted = [...new Set(utterancesArrFormatted)];
      console.log(utterancesArrFormatted);
      return utterancesArrFormatted.length ? utterancesArrFormatted : null;
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = {
  getUtteranceVariants,
};
