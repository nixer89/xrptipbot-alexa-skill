// sets up dependencies
var Alexa = require('ask-sdk-core');
var i18n = require('i18next');
var sprintf = require('i18next-sprintf-postprocessor');
var fetch = require('node-fetch');
var levenshtein = require('fast-levenshtein');
var eudex = require('talisman/metrics/distance/eudex');
var Long = require('long');

//language properties
var german_properties = require('./translations/german/translation_de');
var english_properties = require('./translations/english/translation_en');
var twitter_to_alexa = require("./translations/twitter_to_alexa/translation_twitter_to_alexa");

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
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      var locale = handlerInput.requestEnvelope.request.locale;

      var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
      if(!accessToken) {
        return handlerInput.responseBuilder
          .speak(requestAttributes.t('ACCOUNT_LINKING'))
          .withLinkAccountCard()
          .getResponse();
      }
      
      console.log("GetBalanceIntent: " + JSON.stringify(handlerInput));
      try {
          let balance = await invokeBackend(BASE_URL+"/action:balance/", {method: "POST", body: JSON.stringify({"token": accessToken})});
          console.log("balance response: " + JSON.stringify(balance));
          if(balance && balance.data && balance.data.balance && balance.data.balance.XRP) {
            console.log("localized amount: " + localizeAmount(locale,balance.data.balance.XRP));
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('ACCOUNT_BALANCE', {amount: localizeAmount(locale,balance.data.balance.XRP)}))
                .reprompt(requestAttributes.t('ACCOUNT_BALANCE', {amount: localizeAmount(locale,balance.data.balance.XRP)}))
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
          console.log(JSON.stringify(err));
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
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    if(!handlerInput.requestEnvelope.context.System.user.accessToken) {
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('ACCOUNT_LINKING'))
        .withLinkAccountCard()
        .getResponse();
    }

    console.log("SendTipIntent: " + JSON.stringify(handlerInput));
    //first, handle user_name and ask user for user_name
    var userResult = await handleUser(handlerInput);
    //now save amount for later use
    attributes.amountToTip = checkNumberSlots(handlerInput);
    handlerInput.attributesManager.setSessionAttributes(attributes);

    console.log("User result from send tip: " + JSON.stringify(userResult));

    return handleUserResult(handlerInput, userResult);
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
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    if(!handlerInput.requestEnvelope.context.System.user.accessToken) {
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
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    if(!handlerInput.requestEnvelope.context.System.user.accessToken) {
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('ACCOUNT_LINKING'))
        .withLinkAccountCard()
        .getResponse();
    }

    console.log("UserNameIntent: " + JSON.stringify(handlerInput));
    var userResult = await handleUser(handlerInput)

    console.log("user result: " + JSON.stringify(userResult));

    return handleUserResult(handlerInput, userResult);
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

    if(isDialogState(handlerInput, DIALOG_STATE.USER_CONFIRMATION)) {
      //user confirmed -> handle amount. Do we have a valid amount already? then send tip confirmation. If not, ask for amount!
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
    }
    //DISABLE AMOUNT CONFIRMATION
    /** else if(isDialogState(handlerInput,DIALOG_STATE.AMOUNT_CONFIRMATION)) {
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
    }*/
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

    if(isDialogState(handlerInput,DIALOG_STATE.USER_CONFIRMATION)) {
      if(attributes.possibleUsers.length > 1) {
        attributes.possibleUsers = attributes.possibleUsers.slice(1);
      } else {
        delete attributes.possibleUsers;
      }

      handlerInput.attributesManager.setSessionAttributes(attributes);
      
      return checkForNextUser(handlerInput);
    }
    //DISABLE AMOUNT CONFIRMATION
    /**
    else if(isDialogState(handlerInput,DIALOG_STATE.AMOUNT_CONFIRMATION )) {
      attributes.dialogState = DIALOG_STATE.AMOUNT_SELECTION;
      delete attributes.amountToTip;
      handlerInput.attributesManager.setSessionAttributes(attributes);
      return handlerInput.responseBuilder
              .speak(requestAttributes.t('ASK_FOR_AMOUNT'))
              .reprompt(requestAttributes.t('ASK_FOR_AMOUNT'))
              .getResponse();
    } */
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
    var speechOutput = requestAttributes.t('ASK_FOR_USER_CONFIRMATION', {user: resolveProperName(user.s), network: user.n});
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

function resolveProperName(user_name) {
  console.log("twitter_to_alexa properties: " + JSON.stringify(twitter_to_alexa));
  console.log("user slug:" + user_name);
  if(twitter_to_alexa && twitter_to_alexa[user_name])
    return twitter_to_alexa[user_name];
  else
    return user_name;
}

async function sendTipViaTipBot(handlerInput, amount, user) {
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

  var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
  if(!accessToken) {
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('ACCOUNT_LINKING'))
      .withLinkAccountCard()
      .getResponse();
  }

  console.log("sending " + amount + " XRP an " + JSON.stringify(user));
  try {
    if(amount && user) {
      console.log("We have an amount and user");
      //found single user -> repromt to send
      if(amount <= 20) { //make sure to not send too much in testing! 
        console.log("amount is valid");
        var sendTipResponse = await invokeBackend(BASE_URL+"/action:tip/", {method: "POST", body: JSON.stringify({"token": accessToken, "amount": amount, "to":"xrptipbot://"+user.n+"/"+user.u})});

        var speechOutput = handleSentTipResponse(handlerInput, sendTipResponse, amount, user.s);
        return handlerInput.responseBuilder
          .speak(speechOutput)
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
    console.log(JSON.stringify(err));
    return handlerInput.responseBuilder
          .speak(requestAttributes.t('ERROR_MESSAGE'))
          .getResponse();
  }
}

function handleSentTipResponse(handlerInput, response, amount, username) {
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
  var locale = handlerInput.requestEnvelope.request.locale;

  if(response && response.data && response.data.code) {
    switch(response.data.code) {
      case 200: return requestAttributes.t('TIP_SENT_RESPONSE', {amount:localizeAmount(locale,amount), user: resolveProperName(username)});
      case 300: return requestAttributes.t('RESPONSE_ERROR_300');
      case 400: return requestAttributes.t('RESPONSE_ERROR_400');
      case 401: return requestAttributes.t('RESPONSE_ERROR_401_WITH_AMOUNT', {amount: localizeAmount(locale,amount)});
      case 403: return requestAttributes.t('RESPONSE_ERROR_403');
      case 404: return requestAttributes.t('RESPONSE_ERROR_404');
      case 500: return requestAttributes.t('RESPONSE_ERROR_500');
      default : return requestAttributes.t('ERROR_MESSAGE');
    }
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
  //var locale = handlerInput.requestEnvelope.request.locale;
  
  try {
    //check if we have numbers
    var wholeNumber = (!attributes.amountToTip || isNaN(attributes.amountToTip)) ? checkNumberSlots(handlerInput) : attributes.amountToTip;
    var speechOutput = "";

    console.log("wholeNumber: " + wholeNumber);

    if(isNaN(wholeNumber) || wholeNumber <= 0) {
      if(isDialogState(handlerInput, DIALOG_STATE.USER_CONFIRMATION))
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
      console.log("processing tip confirmation after amount was told");
      //all done -> set amount to tip since we have a valid number!
      attributes.amountToTip = wholeNumber;
      handlerInput.attributesManager.setSessionAttributes(attributes);

      speechOutput = processTipConfirmation(handlerInput);      
    }

    return {speechOutput: speechOutput, reprompt: true, amountAlexa: wholeNumber};
  } catch(err) {
    console.log(JSON.stringify(err));
    return {speechOutput: requestAttributes.t('ERROR_MESSAGE'), reprompt: false};
  }
}

async function handleUser(handlerInput) {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

  var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
  if(!accessToken) {
    return {checkNextUser: false, speechOutput: requestAttributes.t('ACCOUNT_LINKING'), withAccountCard: true}
  }

  var user_slot = handlerInput.requestEnvelope.request.intent.slots.user_name;

  //did not understand any user name -> reprompt user name!
  if(!user_slot || !user_slot.value || user_slot.value == '?') {
    var output = requestAttributes.t('ASK_FOR_USER_FAIL');

    //if new session/intent, ask for user instead of failed user!
    if(isDialogState(handlerInput, DIALOG_STATE.NONE))
      output = requestAttributes.t('ASK_FOR_USER');

    attributes.dialogState = DIALOG_STATE.USER_SELECTION;
    handlerInput.attributesManager.setSessionAttributes(attributes);

    return {checkNextUser: false, speechOutput: output, reprompt:true, withAccountCard: false}
  }

  try {
    if(!attributes.possibleUsers) {
        let userinfo = await invokeBackend(BASE_URL+"/action:contacts/", {method: "POST", body: JSON.stringify({token: accessToken})});
        console.log("userinfo: " + JSON.stringify(userinfo));
        if(userinfo && !userinfo.error && userinfo.data && userinfo.data.length > 0) {
          //compare with levenshtein and sort by lowest distance
          var possibleUsers = userinfo.data;
          possibleUsers.forEach(user => user.distance = levenshtein.get(user.s.toLowerCase(), user_slot.value.toLowerCase()));
          console.log("start getting distance");
          //possibleUsers.forEach(user => { user.distance = eudex.distance(user_slot.value.toLowerCase(),user.s.toLowerCase())});
          console.log("end getting distance");
          possibleUsers.sort((userA, userB) => userA.distance - userB.distance);
          console.log("possible users sorted with eudex distance: " + JSON.stringify(possibleUsers));

          //var possibleUsersSim = userinfo.data;
          //possibleUsersSim.forEach(user => user.levenshtein = stringSimilarity.compareTwoStrings(user.s.toLowerCase(), user_slot.value.toLowerCase()));
          //possibleUsersSim.sort((userA, userB) => userA.levenshtein - userB.levenshtein);
          //console.log("possible users sorted with stringSimilarity: " + JSON.stringify(possibleUsersSim));

          attributes.possibleUsers = possibleUsers;
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
    console.log(JSON.stringify(err));
    return {checkNextUser: false, speechOutput: requestAttributes.t('ERROR_MESSAGE')};
  }
}

function handleUserResult(handlerInput, userResult) {
  
  if(userResult.checkNextUser)
      return checkForNextUser(handlerInput);
    else if(userResult.withAccountCard)
      return handlerInput.responseBuilder
              .speak(userResult.speechOutput)
              .withLinkAccountCard()
              .getResponse();
    else if(userResult.reprompt)
      return handlerInput.responseBuilder
                .speak(userResult.speechOutput)
                .reprompt(userResult.speechOutput)
                .getResponse();
    else
      return handlerInput.responseBuilder
              .speak(userResult.speechOutput)
              .getResponse();
}

function processTipConfirmation(handlerInput) {
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  var locale = handlerInput.requestEnvelope.request.locale;

  console.log("proccessing tip confirmation with attributes: " + JSON.stringify(attributes));
  //we have a valid number -> process tip confirmation
  var amount = attributes.amountToTip;
  var user = attributes.userinfo;
  var speechOutput = requestAttributes.t('TIP_CONFIRMATION', {amount:localizeAmount(locale,amount), user: resolveProperName(user.s)});

  attributes.dialogState = DIALOG_STATE.TIP_CONFIRMATION;
  attributes.lastQuestion = speechOutput;
  handlerInput.attributesManager.setSessionAttributes(attributes);

  return speechOutput;  
}

function isDialogState(handlerInput, checkDialogState) {
  if(!handlerInput.attributesManager.getSessionAttributes().dialogState)
    return DIALOG_STATE.NONE === checkDialogState;
  else 
    return handlerInput.attributesManager.getSessionAttributes().dialogState === checkDialogState;
}

function localizeAmount(locale, amount) {
  var outputAmount = amount+"";

  if(amount) {
    var splitAmount = (amount+"").split('.');
    outputAmount = ""+splitAmount[0];

    if(splitAmount[1]) {
      var pointOrComma = (locale && locale.startsWith('de')) ? ',' : '.'
      outputAmount+="<say-as interpret-as=\"spell-out\">"+pointOrComma+splitAmount[1]+"</say-as>";
    }
  }

  console.log("output amount: " + outputAmount);
  return outputAmount;
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

// constructs i18n and l10n data structure
// translations for this sample can be found at the end of this file
const languageStrings = {
  'de': german_properties.deData(),
  'de-DE': german_properties.deDEData(),
  'en': english_properties.enData(),
  'en-GB': english_properties.enGBData(),
  'en-US': english_properties.enUSData(),
  'en-AU': english_properties.enAUData(),
  'en-CA': english_properties.enCAData(),
  'en-IN': english_properties.enINData(),
};

function invokeBackend(url, options) {

  options.headers = {
      "Content-Type": "application/json",
  };

  return fetch(url, options).then(res => res.json());
}
