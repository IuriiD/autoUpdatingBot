AutoUpdatingBot - Managing the bot through the dialogue (Dialolgflow, node.js)

Video 1: AutoUpdatingBot - Adding intents through dialogue - https://www.youtube.com/watch?v=z8njCLPj9nk

Video description copy:
In this video we will create an auto-updating chatbot which will be self-expanding with new training phrases/responses (intents) through the dialog. The bot will be built on Dialogflow with a webhook written on node.js and hosted on Heroku.

Video 2: AutoUpdatingBot - using intentDetectionConfidence score to add training phrases - https://www.youtube.com/watch?v=Dil5OKKAUgs

Video description copy:
In this update to the previous video https://youtu.be/z8njCLPj9nk , in this series we will update our
bot so that it will be able to automatically save new training phrases to the existing intents based on their similarity to the existing ones (using the intentDetectionConfidence value).

Resources mentioned:

👉 Repository of this project (with Dialogflow agent exported): https://github.com/IuriiD/autoUpdatin...

👉 NLP platform used: https://dialogflow.com/

👉 Actions-on-google package, an example of how to write a fallback function for handling webhook calls: https://developers.google.com/assista...

👉 Github repository with examples of using the dialogflow package (e.g. how to create a new intent, node.js): https://github.com/googleapis/nodejs-...

👉 Bot deployed to: https://www.heroku.com/

https://auto-updating-bot.herokuapp.com/webhook