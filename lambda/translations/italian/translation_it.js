const itData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
<<<<<<< HEAD
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
=======
        WELCOME_MESSAGE: 'Benvenuto alla XRP Tip Bot Skill. Qui puoi controllare il tuo saldo residuo e inviare mance ai tuoi contatti. Come posso aiutarti? ',
        ACCOUNT_LINKING: 'Per cominciare è necessario collagare il tuo account. Per procedere, apri Alexa companion app. ',
        ACCOUNT_BALANCE: 'Il tuo XRP Tip Bot saldo residuo è pari a: %(amount)s XRP. Come posso aiutarti? ',
        ASK_FOR_AMOUNT: 'Quante XRP vorresti inviare? ',
        ASK_FOR_AMOUNT_MAX: 'Si possono inviare un massimo di 20 XRP per volta. ',
        ASK_FOR_AMOUNT_FAIL: 'Mi dispiace ma non ho capito l\'ammontare. Puoi ripetere. ',
        ASK_FOR_AMOUNT_CONFIRMATION: '%(amount)s XRP. L\'ammontare è corretto? ',
        ASK_FOR_AMOUNT_FALLBACK: 'Mi dispiace ma non ho capito. Puoi ripetere l\'ammontare. ',
        ASK_FOR_USER: 'A quale utente vorresti inviare una mancia? ',
        ASK_FOR_USER_FAIL: 'Mi dispiace ma non ho capito il nome dell\'utente. Puoi ripetere. ',
        ASK_FOR_USER_CONFIRMATION: 'Vuoi dire l\'utente %(user)s in %(network)s? ',
        ASK_FOR_USER_FALLBACK: 'Mi dispiace ma non ho capito. Prego ricominciare dicendo: ricerca ... seguito dal nome dell\'utente. ',
        TIP_CONFIRMATION: 'Vuoi inviare %(amount)s XRP all\'utente %(user)s . È corretto? ',
        TIP_SENT_RESPONSE: '%(amount)s XRP sono state inviate a %(user)s. ',
        SENDING_TIP_CANCEL: 'Ok, nessuna XRP è stata inviata. ',
        NO_USER_FOUND: 'Mi dispiace ma non ho potuto trovare nessun utente nalla lista contatti della tua XRP Tip Bot. ',
        NO_MORE_USERS: 'Mi dispiace ma non conosco nessun altro utente con questo nome. Provare nuovamente. ',
        ANSWER_YES_NO: 'Per favore rispondere con si, no o cancella.',
        HELP_MESSAGE: 'Puoi dire... a quanto ammonta il mio saldo residuo, oppure, puoi dire... invia 0.1 XRP. Come posso dunque aiutarti? ',
        HELP_REPROMPT: 'Come posso aiutarti? ',
        FALLBACK_MESSAGE: 'L\'XRP Tip Bot skill non puo aiutarti con questa richiesta. Puo però aiutarti ad inviare mance ai contatti della XRP Tip Bot o a farti sapere il tuo ammontare residuo. Come posso dunque aiutarti? ',
        FALLBACK_REPROMPT: 'Come posso aiutarti? ',
        ERROR_MESSAGE: 'Mi dispiace ma si è verificato un errore. Per favore segnalare l\'errore e riprovare. ',
        STOP_MESSAGE: 'Arrivederci! Alla prossima volta! ',
        RESPONSE_ERROR_404: 'L\'utente destinatario non si é ancora registrato al sito web XRP Tip Bot. ',
        RESPONSE_ERROR_403: 'Nessun ammontare è stato specificato. Si è verificato un problema. Per favore segnalare l\'errore. ',
        RESPONSE_ERROR_401_WITH_AMOUNT: 'Il saldo residuo non è sufficiente per inviare %(amount)s XRP. Per favore ricarica il tuo XRP Tip Bot account e prova di nuovo. ',
        RESPONSE_ERROR_413: 'Hai superato il limite massimo per mancia. Non puoi inviare l\'ammontare richiesto. ',
        RESPONSE_ERROR_500: 'L\'indirizzo di destinazione è invalido. Per favore segnalare il problema. ',
        RESPONSE_ERROR_300: 'Mi dispiace ma non puoi inviare una mancia a te stesso. ',
        RESPONSE_ERROR_400: 'L\'utente destinatario ha disabilitato XRP Tip Bot. ',
>>>>>>> 48d8fb593965b1fd7f73ab9b2e8afffb60941460
    },
};
  
const ititData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
    },
};
  
exports.itData = function() {
    return itData;
}

exports.itITData = function() {
    return ititData;
}
