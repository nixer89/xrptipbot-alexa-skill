// Alexa Fact Skill - Sample for Beginners
/* eslint no-use-before-define: 0 */
// sets up dependencies
var Alexa = require('ask-sdk-core');
var i18n = require('i18next');
var sprintf = require('i18next-sprintf-postprocessor');
var fetch = require('node-fetch');

const BASE_URL = process.env.BASE_URL;
const ACCESS_TOKEN = process.env.ACESS_TOKEN;

const LaunchHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
        if(!ACCESS_TOKEN && !accessToken) {
          return handlerInput.responseBuilder
            .speak(requestAttributes.t('ACCOUNT_LINKING'))
            .reprompt(requestAttributes.t('ACCOUNT_LINKING'))
            .getResponse();
        } else {
          return handlerInput.responseBuilder
          .speak(requestAttributes.t('WELCOME_MESSAGE'))
          .reprompt(requestAttributes.t('WELCOME_MESSAGE'))
          .getResponse();
        }
  },
};
// core functionality for tip bot skill
const GetBalanceIntent = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      // checks request type
      return request.type === 'IntentRequest'
          && request.intent.name === 'GetBalanceIntent'
          && !handlerInput.attributesManager.getSessionAttributes().isYesOrNo;
    },
    async handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        try {
            let balance = await invokeBackend(BASE_URL+"/action:balance/", {method: "POST", body: JSON.stringify({"token": ACCESS_TOKEN})});
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('ACCOUNT_BALANCE',balance.data.balance.XRP))
                .getResponse();
        } catch(err) {
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('ERROR_MESSAGE'))
                .getResponse();
        }  
    },
  };

const YesIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.YesIntent'
        && handlerInput.attributesManager.getSessionAttributes().isYesOrNo;
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;
    const currentIntent = request.intent;

    var user_slot = handlerInput.requestEnvelope.request.intent.slots.user_name;
    user_slot.confirmationStatus = "CONFIRMED";
    delete attributes.isYesOrNo;
    delete attributes.possibleUsers;

    this.SendTipIntent.handle(handlerInput);
  }
}

const NoIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.NoIntent'
        && handlerInput.attributesManager.getSessionAttributes().isYesOrNo;
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;
    const currentIntent = request.intent;

    attributes.possibleUsers = attributes.possibleUsers.slice(1);
    delete attributes.isYesOrNo;
    handlerInput.attributesManager.setSessionAttributes(attributes);

    console.log("attributes in NoIntent: " + JSON.stringify(attributes));
    console.log("forwarding to SendTipIntent");
    
    if(attributes.possibleUsers.length > 0) {
      console.log("setting user: " + attributes.possibleUsers[0]);
      attributes.isYesOrNo = true;
      console.log("attributes: " + JSON.stringify(attributes));
      console.log("user_slot: " + JSON.stringify(user_slot));
      handlerInput.attributesManager.setSessionAttributes(attributes);

      console.log("ask if this is the user!");
      return handlerInput.responseBuilder
              .speak(requestAttributes.t('IS_THIS_USER', user_slot.value))
              .reprompt(requestAttributes.t('IS_THIS_USER', user_slot.value))
              .getResponse();
    } else {
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('NO_MORE_USERS'))
        .getResponse();
    }
  }
}

function checkForNextUser(handlerInput) {
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  
  if(attributes.possibleUsers && attributes.possibleUsers.length > 0) {
    console.log("setting user: " + attributes.possibleUsers[0]);
    attributes.isYesOrNo = true;
    console.log("attributes: " + JSON.stringify(attributes));

    console.log("ask if this is the user!");
    return handlerInput.responseBuilder
            .speak(requestAttributes.t('IS_THIS_USER', attributes.possibleUsers[0][0], attributes.possibleUsers[0][1]))
            .reprompt(requestAttributes.t('IS_THIS_USER', attributes.possibleUsers[0][0], attributes.possibleUsers[0][1]))
            .getResponse();
  } else {
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('NO_MORE_USERS'))
      .getResponse();
  }
}

function sendTipViaTipBot(handlerInput) {
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  try {
    var user = attributes.possibleUsers[0];
    var amount = attributes.amountToTip;
    if(user && amount) {
      //found single user -> repromt to send
      if(amount < 0.1) { //make sure to not send too much in testing! 
        await invokeBackend(BASE_URL+"/action:tip/", {method: "POST", body: JSON.stringify({"token": ACCESS_TOKEN, "amount": amount, "to":"xrptipbot://"+user.network+"/"+user.username})});

        return handlerInput.responseBuilder
          .speak(requestAttributes.t('TIP_SENT_RESPONSE', amount, userinfo.data[0].username))
          .getResponse();
      } else {
        return handlerInput.responseBuilder
          .speak(requestAttributes.t('TIP_TOO_HIGH', amount, userinfo.data[0].username))
          .getResponse();
      }
    }
  } catch(err) {

  }
}

const SendTipIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'IntentRequest'
        && request.intent.name === 'SendTipIntent'
        && !handlerInput.attributesManager.getSessionAttributes().isYesOrNo;
  },
  async handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;
    const currentIntent = request.intent;

    console.log("request: " + JSON.stringify(handlerInput.requestEnvelope.request));
    var amount_slot = handlerInput.requestEnvelope.request.intent.slots.xrp;
    var user_slot = handlerInput.requestEnvelope.request.intent.slots.user_name;
    console.log("amount: " + amount_slot.value);
    console.log("user: " + user_slot.value);

    //make sure to collect to amount first!
    if(!amount_slot || !amount_slot.value || amount_slot.confirmationStatus !== "CONFIRMED") {
      return handlerInput.responseBuilder
                .addDelegateDirective(currentIntent)
                .getResponse();
    }
    else {
      attributes.amountToTip = amount_slot.value;
      handlerInput.attributesManager.setSessionAttributes(attributes);
    }

    //did not understand any user name -> reprompt user name!
    if(user_slot && !user_slot.value) {
        return handlerInput.responseBuilder
                  .addDelegateDirective(currentIntent)
                  .getResponse();
    }

    if(user_slot.confirmationStatus !== "CONFIRMED") {
      try {
        if(!attributes.possibleUsers) {
            let userinfo = await invokeBackend(BASE_URL+"/action:lookup/", {method: "POST", body: JSON.stringify({token: ACCESS_TOKEN, query: user_slot.value})});
            console.log("userinfo: " + JSON.stringify(userinfo));
            if(userinfo && !userinfo.error && userinfo.data.length >0) {
              attributes.possibleUsers = userInfo.data;
            }
            else {
              return handlerInput.responseBuilder
                .speak(requestAttributes.t('NO_USER_FOUND'))
                .getResponse();
            }
            console.log("possible users: " + JSON.stringify(attributes.possibleUsers));
            handlerInput.attributesManager.setSessionAttributes(attributes);

            return checkForNextUser(handlerInput);
        }
      } catch(err) {
        return handlerInput.responseBuilder
          .speak(requestAttributes.t('ERROR_MESSAGE'))
          .getResponse();
      }
    }

    // delegate to Alexa to collect all the required slots
    if (request.dialogState && request.intent.confirmationStatus === 'DENIED') {
      return handlerInput.responseBuilder
          .speak(requestAttributes.t('SENDING_TIP_CANCEL'))
          .getResponse();
    }
    if (request.dialogState && request.intent.confirmationStatus != 'COMPLETED') {
            return handlerInput.responseBuilder
                .addDelegateDirective(currentIntent)
                .getResponse();
    }
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('HELP_MESSAGE'))
      .reprompt(requestAttributes.t('HELP_REPROMPT'))
      .getResponse();
  },
};

const FallbackHandler = {
  // 2018-Aug-01: AMAZON.FallbackIntent is only currently available in en-* locales.
  //              This handler will not be triggered except in those locales, so it can be
  //              safely deployed for any locale.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('FALLBACK_MESSAGE'))
      .reprompt(requestAttributes.t('FALLBACK_REPROMPT'))
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('STOP_MESSAGE'))
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('ERROR_MESSAGE'))
      .reprompt(requestAttributes.t('ERROR_MESSAGE'))
      .getResponse();
  },
};

// inside the index.js
const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en', // fallback to EN if locale doesn't exist
            resources: languageStrings
        });

        localizationClient.localize = function () {
            const args = arguments;
            let values = [];

            for (var i = 1; i < args.length; i++) {
                values.push(args[i]);
            }
            const value = i18n.t(args[0], {
                returnObjects: true,
                postProcess: 'sprintf',
                sprintf: values
            });

            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            } else {
                return value;
            }
        }

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) { // pass on arguments to the localizationClient
            return localizationClient.localize(...args);
        };
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchHandler,
    GetBalanceIntent,
    SendTipIntent,
    YesIntent,
    NoIntent,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();

// translations
const deData = {
  translation: {
    SKILL_NAME: 'XRP Tip Bott',
    WELCOME_MESSAGE: 'Willkommen zum XRP Tip Bott Skill. Du kannst deinen Kontostand abfragen oder Tips an andere User senden.',
    ACCOUNT_LINKING: 'Du musst erst deinen Alexa skill mit dem XRP Tip Bott verbinden. Bitte schaue dazu in die Alexa App.',
    ACCOUNT_BALANCE: 'Dein XRP Tip Bott Kontostand ist: %s XRP.',
    IS_THIS_USER: 'Meinst du den user %s aka %s?',
    TIP_SENT_RESPONSE: '%s XRP wurden an %s gesendet',
    SENDING_TIP_CANCEL: 'Ok, der Vorgang wurde abgebrochen und keine XRP gesendet.',
    NO_USER_FOUND: 'Tut mir leid ich konnte keinen User mit diesem Namen finden. Bitte versuche es erneut',
    NO_MORE_USERS: 'Tut mir leid, ich kann dir keine weiteren User anbieten. Bitte versuce es erneut.',
    TIP_TOO_HIGH: 'Der XRP Betrag ist zu hoch. Es können maximal 1 XRP gesendet werden.',
    HELP_MESSAGE: 'Du kannst sagen, „Wie ist mein Kontostand“, oder du kannst „Sende einen Tip an...“ und dann den Namen der Person. Wie kann ich dir helfen?',
    HELP_REPROMPT: 'Wie kann ich dir helfen?',
    FALLBACK_MESSAGE: 'Der XRP Tip Bott Skill kann dir dabei nicht helfen. Ich kann XRP Tips an Freunde senden oder deinen XRP Tip Bott Kontostand abfragen. Wie kann ich dir helfen?',
    FALLBACK_REPROMPT: 'Wie kann ich dir helfen?',
    ERROR_MESSAGE: 'Es ist ein Fehler aufgetreten.',
    STOP_MESSAGE: 'Auf Wiedersehen!',
  },
};

const dedeData = {
  translation: {
    SKILL_NAME: 'XRP Tip Bot',
  },
};

const enData = {
  translation: {
    SKILL_NAME: 'XRP Tip Bot',
    WELCOME_MESSAGE: 'Welcome to the XRP Tip Bot Skill. Here you can check your balance or send tips to other users.',
    ACCOUNT_LINKING: 'You need to link your account first. Please open the companion app to link your account',
    ACCOUNT_BALANCE: 'Your XRP tip bot balance is: %s XRP.',
    IS_THIS_USER: 'Do you mean the user %s aka s?',
    TIP_SENT_RESPONSE: '%s XRP has been sent to %s',
    SENDING_TIP_CANCEL: 'Ok, no XRP were sent.',
    NO_USER_FOUND: 'Sorry, I could not find a user with that name. Please try again.',
    NO_MORE_USERS: 'Sorr but I dont know any more user with this name. Please try again.',
    TIP_TOO_HIGH: 'The XRP amount is too high. A maximum of 1 XRP can be sent at a time.',
    HELP_MESSAGE: 'You can say what is my balance, or, you can say send a tip to ... and then the name. What can I help you with?',
    HELP_REPROMPT: 'What can I help you with?',
    FALLBACK_MESSAGE: 'The XRP Tip Bot skill can\'t help you with that.  It can help you sending tips to your friends or getting your tip bot balance. What can I help you with?',
    FALLBACK_REPROMPT: 'What can I help you with?',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    STOP_MESSAGE: 'Goodbye!'
  },
};

const engbData = {
  translation: {
    SKILL_NAME: 'XRP Tip Bot',
  },
};

const enusData = {
  translation: {
    SKILL_NAME: 'XRP Tip Bot',
  },
};

// constructs i18n and l10n data structure
// translations for this sample can be found at the end of this file
const languageStrings = {
  'de': deData,
  'de-DE': dedeData,
  'en': enData,
  'en-GB': engbData,
  'en-US': enusData,
};

function invokeBackend(url, options) {

  options.headers = {
      "Content-Type": "application/json",
  };
  return fetch(url, options).then(res => res.json());
}
