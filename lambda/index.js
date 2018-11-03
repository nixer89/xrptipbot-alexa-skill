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
        && (handlerInput.attributesManager.getSessionAttributes().isYesOrNo || handlerInput.attributesManager.getSessionAttributes().sendTipConfirm);
  },
  handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    var amount = attributes.amountToTip;
    var user = attributes.possibleUsers[0];

    //reprompt
    if(amount && user && !attributes.sendTipConfirm) {
      attributes.sendTipConfirm = true;
      handlerInput.attributesManager.setSessionAttributes(attributes)

      return handlerInput.responseBuilder
              .speak(requestAttributes.t('TIP_CONFIRMATION', amount, user.username))
              .reprompt(requestAttributes.t('TIP_CONFIRMATION', amount, user.username))
              .getResponse();
    } else if (amount && user) {
      return sendTipViaTipBot(handlerInput, amount, user);
    }
  }
}

const NoIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.NoIntent'
        && (handlerInput.attributesManager.getSessionAttributes().isYesOrNo || handlerInput.attributesManager.getSessionAttributes().sendTipConfirm);
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    console.log("handle no intent");

    //check if we were in confirmation
    if(attributes.sendTipConfirm) {
      console.log("is checking whole tip")
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('SENDING_TIP_CANCEL'))
        .getResponse();
    }

    console.log("NoIntent attributes: " + JSON.stringify(attributes));

    if(attributes.possibleUsers.length > 1) {
      attributes.possibleUsers = attributes.possibleUsers.slice(1);
    } else {
      delete attributes.possibleUsers;
    }
    delete attributes.isYesOrNo;
    handlerInput.attributesManager.setSessionAttributes(attributes);
    
    return checkForNextUser(handlerInput);
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
    //make sure amount does not exceed 20 XRP
    else if(amount_slot.value > 20) {
      amount_slot.confirmationStatus = "NONE";
      delete amount_slot.value;
      return handlerInput.responseBuilder
                  .speak(requestAttributes.t('TIP_TOO_HIGH') + requestAttributes.t('TIP_TOO_HIGH_ASK'))
                  .reprompt(requestAttributes.t('TIP_TOO_HIGH') + requestAttributes.t('TIP_TOO_HIGH_ASK'))
                  .addDelegateDirective(currentIntent)
                  .getResponse();
    }
    //everthing is ok, set amount!
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

    try {
      if(!attributes.possibleUsers) {
          let userinfo = await invokeBackend(BASE_URL+"/action:lookup/", {method: "POST", body: JSON.stringify({token: ACCESS_TOKEN, query: user_slot.value})});
          console.log("userinfo: " + JSON.stringify(userinfo));
          if(userinfo && !userinfo.error && userinfo.data.length >0) {
            attributes.possibleUsers = userinfo.data;
          }
          else {
            return handlerInput.responseBuilder
              .speak(requestAttributes.t('NO_USER_FOUND'))
              .getResponse();
          }
          console.log("possible users: " + JSON.stringify(attributes.possibleUsers));
          handlerInput.attributesManager.setSessionAttributes(attributes);

          return checkForNextUser(handlerInput);
      } else {
        return handlerInput.responseBuilder
          .speak(requestAttributes.t('ERROR_MESSAGE'))
          .getResponse();
      }
    } catch(err) {
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('ERROR_MESSAGE'))
        .getResponse();
    }
  },
};

function checkForNextUser(handlerInput) {
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  
  if(attributes.possibleUsers && attributes.possibleUsers.length > 0) {
    var user = attributes.possibleUsers[0];
    console.log("setting user: " + JSON.stringify(user));
    attributes.isYesOrNo = true;
    console.log("attributes: " + JSON.stringify(attributes));

    console.log("ask if this is the user!");
    return handlerInput.responseBuilder
            .speak(requestAttributes.t('IS_THIS_USER', user.username, user.slug, user.network))
            .reprompt(requestAttributes.t('IS_THIS_USER', user.username, user.slug, user.network))
            .getResponse();
  } else {
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('NO_MORE_USERS'))
      .getResponse();
  }
}

async function sendTipViaTipBot(handlerInput, amount, user) {
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
  console.log("sending " + amount + " XRP an " + JSON.stringify(user));
  try {
    if(amount && user) {
      console.log("We have an amount and user");
      //found single user -> repromt to send
      if(amount < 20) { //make sure to not send too much in testing! 
        console.log("amount is valid");
        //await invokeBackend(BASE_URL+"/action:tip/", {method: "POST", body: JSON.stringify({"token": ACCESS_TOKEN, "amount": amount, "to":"xrptipbot://"+user.network+"/"+user.username})});

        return handlerInput.responseBuilder
          .speak(requestAttributes.t('TIP_SENT_RESPONSE', amount, user.username))
          .getResponse();
      } else {
        return handlerInput.responseBuilder
          .speak(requestAttributes.t('TIP_TOO_HIGH', amount, user.username))
          .getResponse();
      }
    } else {
      return handlerInput.responseBuilder
          .speak(requestAttributes.t('ERROR_MESSAGE'))
          .getResponse();
    }
  } catch(err) {
    return handlerInput.responseBuilder
          .speak(requestAttributes.t('ERROR_MESSAGE'))
          .getResponse();
  }
}

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
    return request.type === 'IntentRequest';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    if(attributes.isYesOrNo || attributes.sendTipConfirm) {
      return handlerInput.responseBuilder
              .speak(requestAttributes.t('ANSWER_YES_NO'))
              .reprompt(requestAttributes.t('ANSWER_YES_NO'))
              .getResponse();
    }

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
    IS_THIS_USER: 'Meinst du den user %s aka %s von %s?',
    TIP_CONFIRMATION: 'Du willst %s XRP an den User %s senden, ist das korrekt?',
    TIP_SENT_RESPONSE: '%s XRP wurden an %s gesendet',
    SENDING_TIP_CANCEL: 'Ok, der Vorgang wurde abgebrochen und keine XRP gesendet.',
    NO_USER_FOUND: 'Tut mir leid ich konnte keinen User mit diesem Namen finden. Bitte versuche es erneut',
    NO_MORE_USERS: 'Tut mir leid, ich kann dir keine weiteren User anbieten. Bitte versuce es erneut.',
    TIP_TOO_HIGH: 'Der XRP Betrag ist zu hoch. Es können maximal 20 XRP gesendet werden.',
    TIP_TOO_HIGH_ASK: 'Bitte wähle einen neuen Betrag.',
    ANSWER_YES_NO: 'Bitte antworte mit: Ja oder Nein oder sage abbrechen',
    HELP_MESSAGE: 'Du kannst sagen, „Wie ist mein Kontostand“, oder du kannst „Sende einen Tip an...“ und dann den Namen der Person. Wie kann ich dir helfen?',
    HELP_REPROMPT: 'Wie kann ich dir helfen?',
    FALLBACK_MESSAGE: 'Der XRP Tip Bott Skill kann dir dabei nicht helfen. Ich kann XRP Tips an Freunde senden oder deinen XRP Tip Bott Kontostand abfragen. Wie kann ich dir helfen?',
    FALLBACK_REPROMPT: 'Wie kann ich dir helfen?',
    ERROR_MESSAGE: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.',
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
    IS_THIS_USER: 'Do you mean the user %s aka %s from %s?',
    TIP_CONFIRMATION: 'You want to send %s XRP to the user %s . Is this correct?',
    TIP_SENT_RESPONSE: '%s XRP has been sent to %s',
    SENDING_TIP_CANCEL: 'Ok, no XRP were sent.',
    NO_USER_FOUND: 'Sorry, I could not find a user with that name. Please try again.',
    NO_MORE_USERS: 'Sorr but I dont know any more user with this name. Please try again.',
    TIP_TOO_HIGH: 'The XRP amount is too high. A maximum of 20 XRP can be sent at a time.',
    TIP_TOO_HIGH_ASK: 'Please choose a new amount.',
    ANSWER_YES_NO: 'Please answer with yes, no or cancel.',
    HELP_MESSAGE: 'You can say what is my balance, or, you can say send a tip to ... and then the name. What can I help you with?',
    HELP_REPROMPT: 'What can I help you with?',
    FALLBACK_MESSAGE: 'The XRP Tip Bot skill can\'t help you with that.  It can help you sending tips to your friends or getting your tip bot balance. What can I help you with?',
    FALLBACK_REPROMPT: 'What can I help you with?',
    ERROR_MESSAGE: 'Sorry, an error occurred. Please try again.',
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
