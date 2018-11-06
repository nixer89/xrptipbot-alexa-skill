// Alexa Fact Skill - Sample for Beginners
/* eslint no-use-before-define: 0 */
// sets up dependencies
var Alexa = require('ask-sdk-core');
var i18n = require('i18next');
var sprintf = require('i18next-sprintf-postprocessor');
var fetch = require('node-fetch');
var levenshtein = require('fast-levenshtein');

const BASE_URL = process.env.BASE_URL;

var DIALOG_STATE = {
  NONE: 0,
  AMOUNT_SELECTION: 2,
  AMOUNT_CONFIRMATION: 3,
  USER_SELECTION: 4,
  USER_CONFIRMATION: 5,
  TIP_CONFIRMATION: 6,
}

const LaunchHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
        console.log("LaunchRequest: " + JSON.stringify(handlerInput));
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
        if(!accessToken) {
          return handlerInput.responseBuilder
            .speak(requestAttributes.t('ACCOUNT_LINKING'))
            .withLinkAccountCard()
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
          && isDialogState(handlerInput, DIALOG_STATE.NONE);
    },
    async handle(handlerInput) {
      var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
      if(!accessToken) {
        return handlerInput.responseBuilder
          .speak(requestAttributes.t('ACCOUNT_LINKING'))
          .withLinkAccountCard()
          .getResponse();
      }
      console.log("GetBalanceIntent: " + JSON.stringify(handlerInput));
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      var locale = handlerInput.requestEnvelope.request.locale;
      try {
          let balance = await invokeBackend(BASE_URL+"/action:balance/", {method: "POST", body: JSON.stringify({"token": accessToken})});
          if(balance && balance.data && balance.data.balance && balance.data.balance.XRP) {
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('ACCOUNT_BALANCE', localizeAmount(locale,balance.data.balance.XRP)))
                .reprompt(requestAttributes.t('ACCOUNT_BALANCE', localizeAmount(locale,balance.data.balance.XRP)))
                .getResponse();
          } else if(balance && balance.error) {
            //invalid access token
            return handlerInput.responseBuilder
              .speak(requestAttributes.t('ACCOUNT_LINKING'))
              .withLinkAccountCard()
              .getResponse();
          }else {
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

const SendTipIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'IntentRequest'
        && request.intent.name === 'SendTipIntent'
        && isDialogState(handlerInput, DIALOG_STATE.NONE);
  },
  async handle(handlerInput) {
    var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
        if(!accessToken) {
          return handlerInput.responseBuilder
            .speak(requestAttributes.t('ACCOUNT_LINKING'))
            .withLinkAccountCard()
            .getResponse();
        }
    console.log("SendTipIntent: " + JSON.stringify(handlerInput));
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    //first, save attributes

    var handleAmountResult = await handleAmount(handlerInput);
    var user_slot = handlerInput.requestEnvelope.request.intent.slots.user_name;

    attributes.amountAlexaUnderstood = handleAmount.amountAlexa;
    if(user_slot && user_slot.value)
      attributes.userAlexaUnderstood = user_slot.value;
    handlerInput.attributesManager.setSessionAttributes(attributes);

    if(handleAmountResult.reprompt)
      return handlerInput.responseBuilder
                .speak(handleAmountResult.speechOutput)
                .reprompt(handleAmountResult.speechOutput)
                .getResponse();
    else
      return handlerInput.responseBuilder
        .speak(handleAmountResult.speechOutput)
        .getResponse();
  },
};

const AmountIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'IntentRequest'
        && request.intent.name === 'AmountIntent'
        && isDialogState(handlerInput, DIALOG_STATE.AMOUNT_SELECTION);
  },
  async handle(handlerInput) {
    var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
        if(!accessToken) {
          return handlerInput.responseBuilder
            .speak(requestAttributes.t('ACCOUNT_LINKING'))
            .withLinkAccountCard()
            .getResponse();
        }
    console.log("AmountIntent: " + JSON.stringify(handlerInput));
    
    var handleAmountResult = await handleAmount(handlerInput);

    if(handleAmountResult.reprompt)
      return handlerInput.responseBuilder
                .speak(handleAmountResult.speechOutput)
                .reprompt(handleAmountResult.speechOutput)
                .getResponse();
    else
      return handlerInput.responseBuilder
        .speak(handleAmountResult.speechOutput)
        .getResponse();
  },
};

const UserNameIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'IntentRequest'
        && request.intent.name === 'UserNameIntent'
        && isDialogState(handlerInput, DIALOG_STATE.USER_SELECTION);
  },
  async handle(handlerInput) {
    var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
        if(!accessToken) {
          return handlerInput.responseBuilder
            .speak(requestAttributes.t('ACCOUNT_LINKING'))
            .withLinkAccountCard()
            .getResponse();
        }
    console.log("UserNameIntent: " + JSON.stringify(handlerInput));
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    var user_slot = handlerInput.requestEnvelope.request.intent.slots.user_name;

    //did not understand any user name -> reprompt user name!
    if(!user_slot || !user_slot.value || user_slot.value == '?') {
      return handlerInput.responseBuilder
                .speak(requestAttributes.t('ASK_FOR_USER_FAIL'))
                .reprompt(requestAttributes.t('ASK_FOR_USER_FAIL'))
                .getResponse();
    }

    var userResult = await handleUser(handlerInput, user_slot.value)

    if(userResult.checkNextUser)
      return checkForNextUser(handlerInput);
    else if(userResult.withAccountCard)
      return handlerInput.responseBuilder
              .speak(userResult.speechOutput)
              .withLinkAccountCard()
              .getResponse();
    else
      return handlerInput.responseBuilder
              .speak(userResult.speechOutput)
              .getResponse();
  },
};

const YesIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.YesIntent'
        && (isDialogState(handlerInput, DIALOG_STATE.AMOUNT_CONFIRMATION)
            || isDialogState(handlerInput, DIALOG_STATE.USER_CONFIRMATION)
              || isDialogState(handlerInput, DIALOG_STATE.TIP_CONFIRMATION))
  },
  async handle(handlerInput) {
    console.log("YesIntent: " + JSON.stringify(handlerInput));
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    if(isDialogState(handlerInput,DIALOG_STATE.AMOUNT_CONFIRMATION)) {
      //amount confirmed -> handle user!
      attributes.dialogState = DIALOG_STATE.USER_SELECTION;
      handlerInput.attributesManager.setSessionAttributes(attributes);
      if(attributes.userAlexaUnderstood) {
        console.log("handle user alexa understood: " + attributes.userAlexaUnderstood);
        var userResult = await handleUser(handlerInput, attributes.userAlexaUnderstood);

        console.log("finished handleUser with: " + JSON.stringify(userResult));
        if(userResult.checkNextUser)
          return checkForNextUser(handlerInput);
        else if(userResult.withAccountCard)
          return handlerInput.responseBuilder
              .speak(userResult.speechOutput)
              .withLinkAccountCard()
              .getResponse();
        else
          return handlerInput.responseBuilder
              .speak(userResult.speechOutput)
              .getResponse();

      } else
          return handlerInput.responseBuilder
              .speak(requestAttributes.t('ASK_FOR_USER'))
              .reprompt(requestAttributes.t('ASK_FOR_USER'))
              .getResponse();
    }
    else if(isDialogState(handlerInput,DIALOG_STATE.USER_CONFIRMATION)) {
      //user confirmed -> handle tip confirmation
      attributes.dialogState = DIALOG_STATE.TIP_CONFIRMATION;
      var amount = attributes.amountToTip;
      var user = attributes.userinfo;
      var locale = handlerInput.requestEnvelope.request.locale;

      return handlerInput.responseBuilder
              .speak(requestAttributes.t('TIP_CONFIRMATION', localizeAmount(locale,amount), user.u))
              .reprompt(requestAttributes.t('TIP_CONFIRMATION', localizeAmount(locale,amount), user.u))
              .getResponse();
    }
    else if(isDialogState(handlerInput,DIALOG_STATE.TIP_CONFIRMATION)) {
      //sending tip confirmed -> go and send the tip!
      var amount = attributes.amountToTip;
      var user = attributes.userinfo;

      //all checks done -> send the XRP!
      return sendTipViaTipBot(handlerInput, amount, user);
    }
    else {
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('ERROR_MESSAGE'))
        .getResponse();
    }
  }
};

const NoIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.NoIntent'
        && (isDialogState(handlerInput, DIALOG_STATE.AMOUNT_CONFIRMATION)
            || isDialogState(handlerInput, DIALOG_STATE.USER_CONFIRMATION)
              || isDialogState(handlerInput, DIALOG_STATE.TIP_CONFIRMATION));
  },
  handle(handlerInput) {
    console.log("NoIntent: " + JSON.stringify(handlerInput));
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    console.log("handle no intent");

    if(isDialogState(handlerInput,DIALOG_STATE.AMOUNT_CONFIRMATION )) {
      attributes.dialogState = DIALOG_STATE.AMOUNT_SELECTION;
      delete attributes.amountToTip;
      handlerInput.attributesManager.setSessionAttributes(attributes);
      return handlerInput.responseBuilder
              .speak(requestAttributes.t('ASK_FOR_AMOUNT'))
              .reprompt(requestAttributes.t('ASK_FOR_AMOUNT'))
              .getResponse();
    }
    else if(isDialogState(handlerInput,DIALOG_STATE.USER_CONFIRMATION)) {
      if(attributes.possibleUsers.length > 1) {
        attributes.possibleUsers = attributes.possibleUsers.slice(1);
      } else {
        delete attributes.possibleUsers;
      }

      handlerInput.attributesManager.setSessionAttributes(attributes);
      
      return checkForNextUser(handlerInput);
    }
    else if(isDialogState(handlerInput,DIALOG_STATE.TIP_CONFIRMATION)) {
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('SENDING_TIP_CANCEL'))
        .getResponse();
    }

    console.log("NoIntent attributes: " + JSON.stringify(attributes));
  }
};

function checkForNextUser(handlerInput) {
  console.log("checking for next user");
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  console.log("attributes: " + JSON.stringify(attributes));

  if(attributes.possibleUsers && attributes.possibleUsers.length > 0) {
    var user = attributes.possibleUsers[0];
    var speechOutput = requestAttributes.t('ASK_FOR_USER_CONFIRMATION', user.u, user.s, user.n);
    console.log("current user: " + JSON.stringify(user));
    attributes.dialogState = DIALOG_STATE.USER_CONFIRMATION;
    attributes.userinfo = user;
    attributes.lastQuestion = speechOutput;
    handlerInput.attributesManager.setSessionAttributes(attributes);

    console.log("ask if this is the user!");
    return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
  } else {
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('NO_MORE_USERS'))
      .getResponse();
  }
}

async function sendTipViaTipBot(handlerInput, amount, user) {
  var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
        if(!accessToken) {
          return handlerInput.responseBuilder
            .speak(requestAttributes.t('ACCOUNT_LINKING'))
            .withLinkAccountCard()
            .getResponse();
        }
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
  var locale = handlerInput.requestEnvelope.request.locale;
  console.log("sending " + amount + " XRP an " + JSON.stringify(user));
  try {
    if(amount && user) {
      console.log("We have an amount and user");
      //found single user -> repromt to send
      if(amount <= 20) { //make sure to not send too much in testing! 
        console.log("amount is valid");
        await invokeBackend(BASE_URL+"/action:tip/", {method: "POST", body: JSON.stringify({"token": accessToken, "amount": amount, "to":"xrptipbot://"+user.n+"/"+user.u})});

        return handlerInput.responseBuilder
          .speak(requestAttributes.t('TIP_SENT_RESPONSE', localizeAmount(locale,amount), user.u))
          .getResponse();
      } else {
        return handlerInput.responseBuilder
          .speak(requestAttributes.t('ASK_FOR_AMOUNT_MAX'))
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

function checkNumberSlots(handlerInput) {
  var slots = handlerInput.requestEnvelope.request.intent.slots;
  
  try {
    var numberString1 = slots.number_a ? slots.number_a.value : "?";
    var numberString2 = slots.number_b ? slots.number_b.value : "?";
    var numberString3 = slots.number_c ? slots.number_c.value : "?";
    var numberString4 = slots.number_d ? slots.number_d.value : "?";

    //check if we have numbers
    var wholeNumber = '?';

    if(!isNaN(numberString1)) {
      wholeNumber = numberString1;
      if(!isNaN(numberString2)) {
        wholeNumber += "." +numberString2;
        if(!isNaN(numberString3)) {
          wholeNumber += numberString3;
          if(!isNaN(numberString4)) {
            wholeNumber += numberString4;
          }
        }
      }
    }

    return wholeNumber;

  } catch(err) {
    return "?";
  }
}

function handleAmount(handlerInput) {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
  var locale = handlerInput.requestEnvelope.request.locale;
  
  try {
    //check if we have numbers
    var wholeNumber = checkNumberSlots(handlerInput);
    var speechOutput = "";

    console.log("wholeNumber: " + wholeNumber);

    if(isNaN(wholeNumber) || wholeNumber <= 0) {
      if(isDialogState(handlerInput, DIALOG_STATE.NONE))
        speechOutput = requestAttributes.t('ASK_FOR_AMOUNT');
      else
        speechOutput = requestAttributes.t('ASK_FOR_AMOUNT_FAIL');

      attributes.dialogState = DIALOG_STATE.AMOUNT_SELECTION;
      attributes.lastQuestion = speechOutput;
      handlerInput.attributesManager.setSessionAttributes(attributes);
    //} else if(new Number(wholeNumber) <= 0.001) {
    //  speechOutput = requestAttributes.t('ASK_FOR_AMOUNT_MIN') + requestAttributes.t('ASK_FOR_AMOUNT');
    }  else if(new Number(wholeNumber) > 20) {
      speechOutput = requestAttributes.t('ASK_FOR_AMOUNT_MAX') + requestAttributes.t('ASK_FOR_AMOUNT');
      attributes.dialogState = DIALOG_STATE.AMOUNT_SELECTION;
      attributes.lastQuestion = speechOutput;
      handlerInput.attributesManager.setSessionAttributes(attributes);
    } else {
      speechOutput = requestAttributes.t('ASK_FOR_AMOUNT_CONFIRMATION', localizeAmount(locale, wholeNumber));

      attributes.dialogState = DIALOG_STATE.AMOUNT_CONFIRMATION;
      attributes.amountToTip = wholeNumber;
      attributes.lastQuestion = speechOutput;
      handlerInput.attributesManager.setSessionAttributes(attributes);
    }

    return {speechOutput: speechOutput, reprompt: true, amountAlexa: wholeNumber};
  } catch(err) {
    return {speechOutput: requestAttributes.t('ERROR_MESSAGE'), reprompt: false};
  }
}

async function handleUser(handlerInput, user_name) {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

  var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
        if(!accessToken) {
          return {checkNextUser: false, speechOutput: requestAttributes.t('ACCOUNT_LINKING'), withAccountCard: true}
        }

  try {
    if(!attributes.possibleUsers) {
        let userinfo = await invokeBackend(BASE_URL+"/action:contacts/", {method: "POST", body: JSON.stringify({token: accessToken})});
        console.log("userinfo: " + JSON.stringify(userinfo));
        if(userinfo && !userinfo.error && userinfo.data && userinfo.data.length > 0) {
          //compare with levenshtein and sort by lowest distance
          var possibleUsers = userinfo.data;
          possibleUsers.forEach(user => user.levenshtein = levenshtein.get(user.u, user_name));
          possibleUsers.sort((userA, userB) => userA.levenshtein - userB.levenshtein);

          attributes.possibleUsers = possibleUsers;
          console.log("possible users sorted: " + JSON.stringify(attributes.possibleUsers));
          handlerInput.attributesManager.setSessionAttributes(attributes);
          console.log("attributes set, returning check of next user");
          return {checkNextUser: true, speechOutput: ""};
        } else {
          return {checkNextUser: false, speechOutput: requestAttributes.t('NO_USER_FOUND')};
        }
    } else {
      return {checkNextUser: false, speechOutput: requestAttributes.t('ERROR_MESSAGE')};
    }
  } catch(err) {
    return {checkNextUser: false, speechOutput: requestAttributes.t('ERROR_MESSAGE')};
  }
}

function isDialogState(handlerInput, checkDialogState) {
  if(!handlerInput.attributesManager.getSessionAttributes().dialogState)
    return DIALOG_STATE.NONE === checkDialogState;
  else 
    return handlerInput.attributesManager.getSessionAttributes().dialogState === checkDialogState;
}

function localizeAmount(locale, amount) {
  if(locale.startsWith('de'))
    return amount.replace('.',',');
  else
    return amount;
}

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    console.log("HelpHandler: " + JSON.stringify(handlerInput));
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    //cleanup
    cleanup(handlerInput);

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
    console.log("FallbackHandler: " + JSON.stringify(handlerInput));
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    if(isDialogState(handlerInput, DIALOG_STATE.AMOUNT_CONFIRMATION)
      || isDialogState(handlerInput, DIALOG_STATE.USER_CONFIRMATION)
      || isDialogState(handlerInput, DIALOG_STATE.TIP_CONFIRMATION)) {
      return handlerInput.responseBuilder
              .speak(requestAttributes.t('ANSWER_YES_NO') + attributes.lastQuestion)
              .reprompt(requestAttributes.t('ANSWER_YES_NO') + attributes.lastQuestion)
              .getResponse();
    } else if(isDialogState(handlerInput, DIALOG_STATE.AMOUNT_SELECTION)) {
      return handlerInput.responseBuilder
              .speak(requestAttributes.t('ASK_FOR_AMOUNT_FALLBACK'))
              .reprompt(requestAttributes.t('ASK_FOR_AMOUNT_FALLBACK'))
              .getResponse();
    } else if(isDialogState(handlerInput, DIALOG_STATE.USER_SELECTION)) {
      return handlerInput.responseBuilder
              .speak(requestAttributes.t('ASK_FOR_USER_FALLBACK'))
              .reprompt(requestAttributes.t('ASK_FOR_USER_FALLBACK'))
              .getResponse();
    }

    cleanup(handlerInput);

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
    console.log("ExitHandler: " + JSON.stringify(handlerInput));
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
    console.log("SessionEndedRequestHandler: " + JSON.stringify(handlerInput));
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log("ErrorHandler: " + JSON.stringify(handlerInput));
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('ERROR_MESSAGE'))
      .getResponse();
  },
};

function cleanup(handlerInput) {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  delete attributes.dialogState;
  handlerInput.attributesManager.setSessionAttributes(attributes);
}
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
    AmountIntent,
    UserNameIntent,
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
    WELCOME_MESSAGE: 'Willkommen zum XRP Tip Bott Skill. Du kannst deinen Kontostand abfragen oder Tips an andere User senden. Wie kann ich dir helfen? ',
    ACCOUNT_LINKING: 'Du musst erst deinen Alexa skill mit dem XRP Tip Bott verbinden. Bitte schaue dazu in die Alexa App. ',
    ACCOUNT_BALANCE: 'Dein XRP Tip Bott Kontostand ist: %s XRP. Wie kann ich dir sonst helfen?',
    ASK_FOR_AMOUNT: 'Wie viele XRP willst du senden? ',
    ASK_FOR_AMOUNT_MIN: 'Es müssen mindestens 0,001 XRP gesendet werden. ',
    ASK_FOR_AMOUNT_MAX: 'Es können maximal 20 XRP gesendet werden. ',
    ASK_FOR_AMOUNT_FAIL: 'Sorry, ich habe die Zahl nicht verstanden. Bitte wiederhole. ',
    ASK_FOR_AMOUNT_CONFIRMATION: '%s XRP. Richtig? ',
    ASK_FOR_AMOUNT_FALLBACK: 'Sorry, das habe ich leider nicht verstanden. Bitte wiederhole den Betrag. ',
    ASK_FOR_USER: 'An welchen User willst du deinen Tipp senden? ',
    ASK_FOR_USER_FAIL: 'Sorry, ich habe den User nicht verstanden. Bitte wiederhole. ',
    ASK_FOR_USER_CONFIRMATION: 'Meinst du den user %s aka %s von %s? ',
    ASK_FOR_USER_FALLBACK: 'Das habe ich leider nicht verstanden. Bitte sage: an ... und dann den Usernamen. ',
    TIP_CONFIRMATION: 'Du willst %s XRP an den User %s senden, korrekt? ',
    TIP_SENT_RESPONSE: '%s XRP wurden an %s gesendet. ',
    SENDING_TIP_CANCEL: 'Ok, der Vorgang wurde abgebrochen und keine XRP gesendet. ',
    NO_USER_FOUND: 'Tut mir leid ich konnte keinen User mit diesem Namen finden. ',
    NO_MORE_USERS: 'Tut mir leid, ich kann dir keine weiteren User anbieten. Bitte versuce es erneut. ',
    ANSWER_YES_NO: 'Bitte antworte mit Ja, Nein oder sage abbrechen. ',
    HELP_MESSAGE: 'Du kannst sagen, „Wie ist mein Kontostand“, oder „Sende 0,1 XRP“. Wie kann ich dir helfen? ',
    HELP_REPROMPT: 'Wie kann ich dir helfen? ',
    FALLBACK_MESSAGE: 'Der XRP Tip Bott Skill kann dir dabei nicht helfen. Ich kann XRP Tips an deine XRP Tip Bott Kontakte senden oder deinen XRP Tip Bott Kontostand abfragen. Wie kann ich dir helfen?',
    FALLBACK_REPROMPT: 'Wie kann ich dir helfen? ',
    ERROR_MESSAGE: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut. ',
    STOP_MESSAGE: 'Auf Wiedersehen! Bis zum nächsten mal.',
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
    WELCOME_MESSAGE: 'Welcome to the XRP Tip Bot Skill. Here you can check your balance or send tips to you contacts. What can I help you with?',
    ACCOUNT_LINKING: 'You need to link your account first. Please open the Alexa companion app to link your account',
    ACCOUNT_BALANCE: 'Your XRP tip bot balance is: %s XRP. How can I help you with?',
    ASK_FOR_AMOUNT: 'How many XRP you want to send?',
    ASK_FOR_AMOUNT_MAX: 'A maxiumum of 20 XRP can be sent at a time.',
    ASK_FOR_AMOUNT_FAIL: 'Sorry, I did not understand the number. Please repeat.',
    ASK_FOR_AMOUNT_CONFIRMATION: '%s XRP. Correct?',
    ASK_FOR_AMOUNT_FALLBACK: 'Sorry, I could not understand. Please repeat the amount',
    ASK_FOR_USER: 'To which user you want to send your tip to?',
    ASK_FOR_USER_FAIL: 'Sorry, I did not understand the user. Please repeat.',
    ASK_FOR_USER_CONFIRMATION: 'Do you mean the user %s aka %s from %s?',
    ASK_FOR_USER_FALLBACK: 'Sorry, I could not understand. Please start with: to... and the user name.',
    TIP_CONFIRMATION: 'You want to send %s XRP to the user %s . Correct?',
    TIP_SENT_RESPONSE: '%s XRP has been sent to %s .',
    SENDING_TIP_CANCEL: 'Ok, no XRP has been sent.',
    NO_USER_FOUND: 'Sorry, I could not find a user with this name.',
    NO_MORE_USERS: 'Sorry but I dont know any more users with this name. Please try again.',
    ANSWER_YES_NO: 'Please answer with yes, no or cancel.',
    HELP_MESSAGE: 'You can say... what is my balance, or, you can say... send 0.1 XRP. What can I help you with?',
    HELP_REPROMPT: 'What can I help you with?',
    FALLBACK_MESSAGE: 'The XRP Tip Bot skill can\'t help you with that. It can help you sending tips to your XRP Tip Bot contacts or getting your tip bot balance. What can I help you with?',
    FALLBACK_REPROMPT: 'What can I help you with?',
    ERROR_MESSAGE: 'Sorry, an error occurred. Please report the problem and try again.',
    STOP_MESSAGE: 'Goodbye! See you next time!'
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
  return fetch(url, options).then(res => {
    return res.json();
  });
}
