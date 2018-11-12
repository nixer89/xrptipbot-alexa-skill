const frData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
        WELCOME_MESSAGE: 'Welcome to the XRP Tip Bot Skill. Here you can check your balance or send tips to you contacts. What can I help you with? ',
        ACCOUNT_LINKING: 'You need to link your account first. Please open the Alexa companion app to link your account. ',
        ACCOUNT_BALANCE: 'Your XRP Tip Bot balance is: %(amount)s XRP. What can I help you with? ',
        ASK_FOR_AMOUNT: 'How many XRP do you want to send? ',
        ASK_FOR_AMOUNT_MAX: 'A maxiumum of 20 XRP can be sent at a time. ',
        ASK_FOR_AMOUNT_FAIL: 'Sorry, I did not understand the amount. Please repeat. ',
        ASK_FOR_AMOUNT_CONFIRMATION: '%(amount)s XRP. Correct? ',
        ASK_FOR_AMOUNT_FALLBACK: 'Sorry, I could not understand. Please repeat the amount. ',
        ASK_FOR_USER: 'Which user do you want to send your tip to? ',
        ASK_FOR_USER_FAIL: 'Sorry, I did not understand the username. Please repeat. ',
        ASK_FOR_USER_CONFIRMATION: 'Do you mean the user %(user)s from %(network)s? ',
        ASK_FOR_USER_FALLBACK: 'Sorry, I could not understand. Please start with: search for ... and the user name. ',
        TIP_CONFIRMATION: 'You want to send %(amount)s XRP to the user %(user)s . Correct? ',
        TIP_SENT_RESPONSE: '%(amount)s XRP has been sent to %(user)s . ',
        SENDING_TIP_CANCEL: 'Ok, no XRP has been sent. ',
        NO_USER_FOUND: 'Sorry, I could not find any user in your XRP Tip Bot contacts list. ',
        NO_MORE_USERS: 'Sorry, but I dont know any other users with this name. Please try again. ',
        ANSWER_YES_NO: 'Please answer with yes, no or cancel.',
        HELP_MESSAGE: 'You can say... what is my balance, or, you can say... send 0.1 XRP. So, what can I help you with? ',
        HELP_REPROMPT: 'What can I help you with? ',
        FALLBACK_MESSAGE: 'The XRP Tip Bot skill can\'t help you with that. It can help you sending tips to your XRP Tip Bot contacts or getting your Tip Bot balance. So, what can I help you with? ',
        FALLBACK_REPROMPT: 'What can I help you with? ',
        ERROR_MESSAGE: 'Sorry, an error occurred. Please report the problem and try again. ',
        STOP_MESSAGE: 'Goodbye! See you next time! ',
        RESPONSE_ERROR_404: 'The destination user never logged in at the XRP Tip Bot website. ',
        RESPONSE_ERROR_403: 'No amount has been specified. Something went wrong. Please report this problem. ',
        RESPONSE_ERROR_401_WITH_AMOUNT: 'You have an insufficient balance to send %(amount)s XRP. Please top up your XRP Tip Bot account and try again. ',
        RESPONSE_ERROR_413: 'You exceeded the per-tip limit. I cannot send that amount of XRP. ',
        RESPONSE_ERROR_500: 'The destination address is invalid. Please report this problem. ',
        RESPONSE_ERROR_300: 'Sorry, but you can\'t tip yourself. ',
        RESPONSE_ERROR_400: 'The destination user has disabled the XRP Tip Bot. ',

        API_NOT_AVAILABLE: 'Sorry, but the XRPTipBot API is currently not available. Please try again later.'
    },
};
  
const frfrData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
    },
};
  
const frcaData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
    },
};

exports.frData = function() {
    return frData;
}

exports.frFRData = function() {
    return frfrData;
}

exports.frCAData = function() {
    return frcaData;
}
