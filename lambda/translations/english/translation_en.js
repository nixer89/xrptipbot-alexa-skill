const enData = {
    translation: {
      SKILL_NAME: 'XRP Tip Bot',
      WELCOME_MESSAGE: 'Welcome to the XRP Tip Bot Skill. Here you can check your balance or send tips to you contacts. What can I help you with? ',
      ACCOUNT_LINKING: 'You need to link your account first. Please open the Alexa companion app to link your account. ',
      ACCOUNT_BALANCE: 'Your XRP tip bot balance is: %s XRP. What can I help you with? ',
      ASK_FOR_AMOUNT: 'How many XRP you want to send? ',
      ASK_FOR_AMOUNT_MAX: 'A maxiumum of 20 XRP can be sent at a time. ',
      ASK_FOR_AMOUNT_FAIL: 'Sorry, I did not understand the number. Please repeat. ',
      ASK_FOR_AMOUNT_CONFIRMATION: '%s XRP. Correct? ',
      ASK_FOR_AMOUNT_FALLBACK: 'Sorry, I could not understand. Please repeat the amount. ',
      ASK_FOR_USER: 'To which user you want to send your tip to? ',
      ASK_FOR_USER_FAIL: 'Sorry, I did not understand the user. Please repeat. ',
      ASK_FOR_USER_CONFIRMATION: 'Do you mean the user %s aka %s from %s? ',
      ASK_FOR_USER_FALLBACK: 'Sorry, I could not understand. Please start with: to... and the user name. ',
      TIP_CONFIRMATION: 'You want to send %s XRP to the user %s . Correct? ',
      TIP_SENT_RESPONSE: '%s XRP has been sent to %s . ',
      SENDING_TIP_CANCEL: 'Ok, no XRP has been sent. ',
      NO_USER_FOUND: 'Sorry, I could not find a user with this name. ',
      NO_MORE_USERS: 'Sorry but I dont know any more users with this name. Please try again. ',
      ANSWER_YES_NO: 'Please answer with yes, no or cancel.',
      HELP_MESSAGE: 'You can say... what is my balance, or, you can say... send 0.1 XRP. What can I help you with? ',
      HELP_REPROMPT: 'What can I help you with? ',
      FALLBACK_MESSAGE: 'The XRP Tip Bot skill can\'t help you with that. It can help you sending tips to your XRP Tip Bot contacts or getting your tip bot balance. What can I help you with? ',
      FALLBACK_REPROMPT: 'What can I help you with? ',
      ERROR_MESSAGE: 'Sorry, an error occurred. Please report the problem and try again. ',
      STOP_MESSAGE: 'Goodbye! See you next time! ',
      RESPONSE_ERROR_404: 'The destination user never logged in at the XRP Tip Bot website. ',
      RESPONSE_ERROR_403: 'No amount has been specified. Something went wrong. Please report this problem. ',
      RESPONSE_ERROR_401_WITH_AMOUNT: 'No or insufficient balance to send %s XRP. ',
      RESPONSE_ERROR_413: 'You exceeded the per-tip limit. I cannot send that amount of XRP. ',
      RESPONSE_ERROR_500: 'The destination address is invalid. Please report this problem. ',
      RESPONSE_ERROR_300: 'Sorry, but you can\'t tip yourself. ',
      RESPONSE_ERROR_400: 'The destination user has disabled the Tip Bot. ',
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

const enauData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
    },
};

const encaData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
    },
};

const eninData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
    },
};

exports.enData = function() {
    return enData;
}

exports.enGBData = function() {
    return engbData;
}

exports.enUSData = function() {
    return enusData;
}

exports.enAUData = function() {
    return enauData;
}

exports.enCAData = function() {
    return encaData;
}

exports.enINData = function() {
    return eninData;
}